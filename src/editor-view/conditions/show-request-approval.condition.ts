import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import {
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION,
  type WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig,
} from "./manifests.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowDocumentWorkspaceVariantShowRequestApprovalCondition
  extends UmbConditionBase<WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig>
  implements UmbExtensionCondition
{
  #init: Promise<unknown>;
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig>
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
        this.#workflowContext.scaffold,
      ]),
      ([activeDocumentVariants, scaffold]) => {
        const config = scaffold?.config;

        if (config) {
          if (
            (!config.contentType.length &&
              !config.inherited.length &&
              !config.node.length) ||
            config.excluded
          ) {
            this.permitted = false;
            return;
          }
        }

        const tasks = scaffold?.tasks;

        // TODO => variant-based permissions. or always show submit button, and manage variants in the modal
        if (!tasks?.variantTasks?.length && tasks?.invariantTask === null) {
          this.permitted = true;
          this.#workflowContext?.removeWorkspaceActions(
            WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION
          );
          return;
        }

        let hasActiveWorkflow = false;
        if (tasks?.invariantTask?.instance?.variantCode === "*") {
          hasActiveWorkflow = true;
        } else {
          let culture = activeDocumentVariants[0]?.culture ?? "*";
          culture = culture === "invariant" ? "*" : culture;
          hasActiveWorkflow = scaffold?.activeVariants?.includes(culture) ?? false;
        }

        // TODO => if not permitted, show the workflow detail button if a variant is active
        this.permitted = !hasActiveWorkflow;

        if (this.permitted) {
          this.#workflowContext?.removeWorkspaceActions(
            WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION
          );
        }
      }
    );
  }
}
