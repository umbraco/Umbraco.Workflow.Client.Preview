import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import {
  Subscription,
  combineLatest,
} from "@umbraco-cms/backoffice/external/rxjs";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type { WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig } from "./manifests.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowDocumentWorkspaceVariantShowRequestApprovalCondition
  extends UmbConditionBase<WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig>
  implements UmbExtensionCondition
{
  #init: Promise<unknown>;
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;
  #subscription = new Subscription();

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig>
  ) {
    super(host, args);

    this.#init = Promise.all([
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
        this.#workspaceContext = instance;
      }).asPromise(),
      this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
        this.#workflowContext = instance;
      }).asPromise(),
    ]);
  }

  async hostConnected() {
    super.hostConnected();
    await this.#init;

    if (!this.#workflowContext || !this.#workspaceContext) return;

    const observable = combineLatest({
      activeDocumentVariants:
        this.#workspaceContext.splitView.activeVariantsInfo,
      scaffold: this.#workflowContext?.scaffold,
    });

    this.#subscription.add(
      observable.subscribe({
        next: (value) => {
          // no config? no button.
          const config = value.scaffold?.config;
          if (config) {
            // TODO => not permitted when new and config.new exists
            if (
              (config.contentType.length === 0 &&
                config.inherited.length === 0 &&
                config.node.length === 0) ||
              config.excluded
            ) {
              this.permitted = false;
              return;
            }
          }

          const tasks = value.scaffold?.tasks;

          // TODO => variant-based permissions. or always show submit button, and manage variants in the modal
          if (
            tasks?.variantTasks?.length === 0 &&
            tasks?.invariantTask === null
          ) {
            this.permitted = true;
            this.#workflowContext?.removeWorkspaceActions(this.config.alias);
            return;
          }

          let hasActiveWorkflow = false;
          if (tasks?.invariantTask?.instance?.variantCode === "*") {
            hasActiveWorkflow = true;
          } else {
            let culture = value.activeDocumentVariants[0]?.culture ?? "*";
            culture = culture === "invariant" ? "*" : culture;

            hasActiveWorkflow =
              !value.scaffold?.activeVariants?.includes(culture);
          }

          // TODO => if not permitted, show the workflow detail button if a variant is active
          this.permitted = hasActiveWorkflow === false;

          if (this.permitted) {
            this.#workflowContext?.removeWorkspaceActions(this.config.alias);
          }
        },
      })
    );
  }

  hostDisconnected(): void {
    this.#subscription.unsubscribe();
  }
}
