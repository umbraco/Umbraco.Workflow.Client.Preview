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
import type { WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig } from "./manifests.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowDocumentWorkspaceVariantShowWorkflowDetailCondition
  extends UmbConditionBase<WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig>
  implements UmbExtensionCondition
{
  #init: Promise<unknown>;
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;
  #subscription = new Subscription();

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig>
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

    // TODO => where is the actual active variant? Is it always first?
    this.#subscription.add(
      observable.subscribe({
        next: (value) => {
          let culture = value.activeDocumentVariants[0]?.culture ?? "*";
          culture = culture === 'invariant' ? "*" : culture;

          if (value.scaffold?.activeVariants?.length === 0) {
            this.permitted = false;
          } else if (value.scaffold?.activeVariants?.includes("*")) {
            this.permitted = true;
          } else if (value.scaffold?.activeVariants?.includes(culture)) {
            this.permitted = true;
          }

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
