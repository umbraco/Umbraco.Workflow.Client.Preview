import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import type { WorkflowStateUser } from "./entities.js";
import {
  type GlobalWorkflowVariablesModel,
  type WorkflowTaskModel,
} from "@umbraco-workflow/generated";

export class UserActionsManagerController extends UmbControllerBase {
  rejected = false;
  isAdmin = false;

  #currentUserUnique?: string | null;
  #isChangeAuthor = false;
  #canAction = false;
  #canResubmit?: boolean;
  #contentLocked = false;

  #globalVariables?: GlobalWorkflowVariablesModel;
  #currentTask?: WorkflowTaskModel | null;

  #init: Promise<unknown>;

  constructor(
    host: UmbControllerHost,
    globalVariables?: GlobalWorkflowVariablesModel,
    currentTask?: WorkflowTaskModel | null
  ) {
    super(host, "WorkflowUserActionsManagerController");

    this.#globalVariables = globalVariables;
    this.#currentTask = currentTask;

    this.#init = Promise.all([
      this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
        if (!context) return;
        this.#currentUserUnique = context.getUnique();
        this.isAdmin = context.getIsAdmin() ?? false;
      }).asPromise(),
    ]);
  }

  async getUserActions(): Promise<WorkflowStateUser> {
    await this.#init;

    this.#buildActions();
    this.#setCanEdit();

    return {
      canActionTask:
        this.#canAction || this.#canResubmit || this.#isChangeAuthor,
      canAction: this.#canAction && !this.rejected,
      canCancel: this.#canAction || this.#isChangeAuthor,
      canEdit: !this.#contentLocked,
      canResubmit: this.#canResubmit,
      isAdmin: this.isAdmin ?? false,
      isChangeAuthor: this.#isChangeAuthor,
    };
  }

  async #setCanEdit() {
    if (!this.#currentTask) return;

    this.#contentLocked = false;

    if (this.#globalVariables?.lockIfActive && !this.isAdmin) {
      this.#contentLocked = true;
    }

    // if locked, no one can edit, unless they have canResubmit permission
    // OR isAdmin is true, and adminCanEdit is also true
    // HOWEVER changeAuthor can edit, if the workflow has not had any approvals
    const isAuthorUserAndNoApprovals =
      this.#isChangeAuthor &&
      this.#currentTask.currentStep === 0 &&
      this.#currentTask.approvedByIds?.length === 0 &&
      this.#currentTask.status === "PendingApproval";

    const isAdminAndCanEdit =
      this.#globalVariables?.adminCanEdit && this.isAdmin;

    if (isAuthorUserAndNoApprovals || isAdminAndCanEdit) {
      return;
    }

    // will be undefined if the document is not in a pending workflow
    // and only false if the current user cannot resubmit the rejected workflow
    this.#contentLocked = this.#canResubmit !== true;
  }

  #buildActions() {
    if (!this.#currentTask) return;

    this.#setRejected();
    this.#setChangeAuthor();
    this.#setCanAction();
    this.#setCanResubmit();
  }

  #setRejected() {
    this.rejected = this.#currentTask?.instance?.status === "Rejected";
  }

  #setChangeAuthor() {
    // if the task has been rejected and the current user requested the change, let them edit
    this.#isChangeAuthor =
      this.#currentTask?.instance?.requestedByKey === this.#currentUserUnique;
  }

  #setCanAction() {
    if (!this.#currentTask) return;

    const userInAssignedGroup =
      this.#currentTask.userGroup?.users?.some(
        (u) => u.userUnique === this.#currentUserUnique
      ) ?? false;

    // if the current user is a member of the group and task is pending, they can action, UNLESS...
    // if the user requested the change, is a member of the current group, and flow type is exclude, they cannot action
    // if the user has already approved the change in a task where the approval threshold is > 1, they cannot action
    this.#canAction =
      userInAssignedGroup && !this.rejected && !this.#hasAlreadyApproved();

    if (
      this.#globalVariables?.flowType !== "Explicit" &&
      this.#isChangeAuthor
    ) {
      this.#canAction = false;
    }
  }

  #setCanResubmit() {
    if (!this.rejected || !this.#currentTask) return;

    const userInAssignedGroup = this.#isUserInAssignedGroup();
    this.#canResubmit =
      (this.rejected && !this.#currentTask.assignTo && this.#isChangeAuthor) ||
      (!!this.#currentTask.assignTo && userInAssignedGroup);
  }

  #isUserInAssignedGroup(): boolean {
    return (
      this.#currentTask?.userGroup?.users?.some(
        (u) => u.userUnique === this.#currentUserUnique
      ) ?? false
    );
  }

  #hasAlreadyApproved(): boolean {
    return (
      this.#currentTask?.approvedByIds?.some(
        (id) => id === this.#currentUserUnique
      ) ?? false
    );
  }
}
