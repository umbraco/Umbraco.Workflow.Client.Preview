import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { WORKFLOW_DOCUMENT_UNLOCK_MODAL } from "../modal/index.js";
import { ConfigService } from "@umbraco-workflow/generated";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowDocumentUnlockWorkspaceAction extends UmbWorkspaceActionBase {
  async #unlock(unique: string, publish: boolean, culture: string | null) {
    const { data } = await tryExecute(
      this,
      ConfigService.postConfigUnlock({
        body: {
          unique,
          culture,
          publish,
        },
      })
    );

    if (!data) return;

    // when the response is true, the node has been unlocked and should be reloaded
    // to refresh the workflow state and remove the notifications/readonly mode
    const workflowContext = await this.getContext(WORKFLOW_MANAGER_CONTEXT);
    if (!workflowContext) return;

    workflowContext.refreshScaffold();
  }

  async execute() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) {
      throw new Error("Context not found: UMB_MODAL_MANAGER_CONTEXT");
    }

    const modalHandler = modalContext.open(
      this,
      WORKFLOW_DOCUMENT_UNLOCK_MODAL
    );

    const result = await modalHandler.onSubmit().catch(() => undefined);
    if (!result) return;

    const publish = modalHandler.getValue()?.publish ?? false;

    const workpaceContext = await this.getContext(
      UMB_DOCUMENT_WORKSPACE_CONTEXT
    );
    if (!workpaceContext) {
      throw new Error("Context not found: UMB_DOCUMENT_WORKSPACE_CONTEXT");
    }

    this.observe(
      observeMultiple([
        workpaceContext.varies,
        workpaceContext.unique,
        workpaceContext.splitView.activeVariantsInfo,
      ]),
      async ([varies, unique, activeVariant]) => {
        // varies emits once everything is loaded, so works as a guard
        if (varies === undefined || !activeVariant.length || !unique) return;
        await this.#unlock(unique, publish, activeVariant[0].culture);
      }
    );
  }
}

export { WorkflowDocumentUnlockWorkspaceAction as api };
