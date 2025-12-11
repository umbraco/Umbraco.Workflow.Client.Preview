import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowTaskModel } from "@umbraco-workflow/generated";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import { WORKFLOW_DETAIL_MODAL } from "@umbraco-workflow/core";

export class WorkflowDetailWorkspaceAction extends UmbWorkspaceActionBase {
  #currentTask?: WorkflowTaskModel | null;

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
    if (!this.#currentTask?.instance?.entityType) return;

    await umbOpenModal(this, WORKFLOW_DETAIL_MODAL, {
      data: {
        document: {
          name: this.#currentTask.node?.name ?? undefined,
          unique: this.#currentTask.node?.key,
        },
        entityKey: this.#currentTask?.instance?.entityKey,
        entityType: this.#currentTask.instance?.entityType,
        culture: this.#currentTask.instance?.cultureCode ?? undefined,
        action:
          this.#currentTask.instance?.type === "Unpublish"
            ? "unpublish"
            : "publish",
        isDashboard: false,
      },
    });
  }
}

export { WorkflowDetailWorkspaceAction as api };
