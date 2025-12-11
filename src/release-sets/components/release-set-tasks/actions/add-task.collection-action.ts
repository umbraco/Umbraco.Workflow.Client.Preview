import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../workspace/release-set-workspace.context-token.js";
import { WORKFLOW_RELEASESET_TASK_EDITOR_MODAL } from "../../../modal/index.js";
import { taskProperties } from "../task-properties.js";
import { type ReleaseSetTaskResponseModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetTaskCollectionAddTaskAction extends UmbControllerBase {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  constructor(host: UmbControllerHost) {
    super(host);

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
    });
  }

  async execute() {
    umbOpenModal(this, WORKFLOW_RELEASESET_TASK_EDITOR_MODAL, {
      data: {
        properties: taskProperties.filter((x) => x.create !== false),
      },
    })
      .then((result) =>
        this.#workspaceContext?.addTask(
          result.task as ReleaseSetTaskResponseModel
        )
      )
      .catch(() => {});
  }
}
