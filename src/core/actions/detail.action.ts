import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import {
  UmbWorkspaceActionBase,
} from "@umbraco-cms/backoffice/workspace";
import type { WorkflowTaskModelReadable } from "@umbraco-workflow/generated";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import { WORKFLOW_DETAIL_MODAL } from "@umbraco-workflow/editor-view";

export class WorkflowDetailWorkspaceAction extends UmbWorkspaceActionBase {
  #currentTask?: WorkflowTaskModelReadable | null;

  hostConnected() {
    super.hostConnected();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.scaffold, (scaffold) => {
        this.#currentTask = scaffold?.tasks?.invariantTask;
      });
    });
  }

  async execute() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!this.#currentTask?.instance?.entityType || !modalContext) return;

    modalContext.open(this, WORKFLOW_DETAIL_MODAL, {
      data: {
        document: {
          name: this.#currentTask.node?.name ?? undefined,
          unique: this.#currentTask.node?.key,
        },
        entityKey: this.#currentTask?.instance?.entityKey,
        entityType: this.#currentTask.instance?.entityType,        
        variant: this.#currentTask.instance?.variantCode ?? undefined, 
        action: this.#currentTask.instance?.type === "Unpublish" ? "unpublish" : "publish",
        isDashboard: false,
      },
    });
  }
}

export { WorkflowDetailWorkspaceAction as api }