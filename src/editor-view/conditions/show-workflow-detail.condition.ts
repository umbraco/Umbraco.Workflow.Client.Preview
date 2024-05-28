import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import {
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION,
  type WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig,
} from "./manifests.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import {
  WorkflowStatusModel,
  type GlobalVariablesModel,
  type WorkflowScaffoldResponseModel,
  type WorkflowTaskModel,
} from "@umbraco-workflow/generated";
import { WorkflowStatus } from "@umbraco-workflow/core";

export class WorkflowDocumentWorkspaceVariantShowWorkflowDetailCondition
  extends UmbConditionBase<WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig>
  implements UmbExtensionCondition
{
  #init: Promise<unknown>;
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;

  #globalVariables?: GlobalVariablesModel;
  #scaffold?: WorkflowScaffoldResponseModel;

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig>
  ) {
    super(host, args);

    this.#init = Promise.all([
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
        this.#workspaceContext = context;
      }).asPromise(),
      this.consumeContext(WORKFLOW_CONTEXT, (context) => {
        this.#workflowContext = context;
      }).asPromise(),
    ]);
  }

  async hostConnected() {
    super.hostConnected();
    await this.#init;

    if (!this.#workflowContext || !this.#workspaceContext) return;

    this.observe(
      observeMultiple([
        this.#workspaceContext.splitView.activeVariantsInfo,
        this.#workflowContext?.scaffold,
        this.#workflowContext?.globalVariables,
      ]),
      ([activeDocumentVariants, scaffold, globalVariables]) => {
        if (!scaffold || !globalVariables) return;

        this.#scaffold = scaffold;
        this.#globalVariables = globalVariables;
        this.permitted = false;

        let culture = activeDocumentVariants[0]?.culture ?? "*";
        culture = culture === "invariant" ? "*" : culture;

        if (this.#scaffold.activeVariants?.length === 0) {
          this.permitted = false;
        } else if (this.#scaffold.activeVariants?.includes("*")) {
          this.permitted = true;
        } else if (this.#scaffold.activeVariants?.includes(culture)) {
          this.permitted = true;
        }

        if (this.permitted) {
          const canEdit = this.#getCanEdit();
          this.#workflowContext?.removeWorkspaceActions(
            WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION,
            canEdit
          );
        }
      }
    );
  }

  #getCanEdit() {
    if (!this.#scaffold || !this.#scaffold.settings?.lockIfActive) {
      return true;
    }

    const currentTask = this.#scaffold.tasks?.invariantTask;

    if (!currentTask) {
      return true;
    }

    const isAuthorUser =
      this.#globalVariables?.currentUserUnique ===
      currentTask?.instance?.requestedByKey;

    // if locked, no one can edit, unless they have canResubmit permission
    // OR isAdmin is true, and adminCanEdit is also true
    // HOWEVER changeAuthor can edit, if the workflow has not had any approvals
    const isAuthorUserAndNoApprovals =
      isAuthorUser &&
      currentTask.currentStep === 0 &&
      currentTask.approvedByIds?.length === 0 &&
      currentTask.status === WorkflowStatus.PENDING_APPROVAL;

    if (isAuthorUserAndNoApprovals) return true;

    const isAdminAndCanEdit =
      this.#scaffold.settings?.adminCanEdit &&
      this.#globalVariables?.currentUserIsAdmin;

    if (isAdminAndCanEdit) return true;

    return this.#canResubmit(isAuthorUser, currentTask);
  }

  #canResubmit(isAuthorUser: boolean, currentTask?: WorkflowTaskModel | null) {
    if (!this.#scaffold) return false;

    const userInAssignedGroup =
      currentTask?.userGroup?.usersSummary?.indexOf(
        `|${this.#globalVariables?.currentUserUnique}|`
      ) !== -1 ?? false;

    const rejected =
      currentTask?.instance?.status === WorkflowStatusModel.REJECTED;

    // if the task has been rejected and the current user requested the change, let them edit
    // if the current user is a member of the group and task is pending, they can action, UNLESS...
    // if the user requested the change, is a member of the current group, and flow type is exclude, they cannot action
    // if the user has already approved the change in a task where the approval threshold is > 1, they cannot action
    let canAction =
      userInAssignedGroup &&
      !rejected &&
      !currentTask?.approvedByIds?.some(
        (id) => id === this.#globalVariables?.currentUserUnique
      );

    if (this.#scaffold.settings?.flowType !== 0 && isAuthorUser && canAction) {
      canAction = false;
    }

    const canResubmit =
      (rejected && !currentTask.assignTo && isAuthorUser) ||
      (!!currentTask?.assignTo && userInAssignedGroup);

    return canResubmit;
  }
}
