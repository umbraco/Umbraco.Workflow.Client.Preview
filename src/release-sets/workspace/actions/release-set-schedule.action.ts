import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbWorkspaceActionBase,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../index.js";
import { WORKFLOW_RELEASESET_SCHEDULE_MODAL } from "../../modal/index.js";

export class WorkflowReleaseSetScheduleAction extends UmbWorkspaceActionBase<never> {
  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);
  }

  override async execute() {
    const workspaceContext = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );

    if (!workspaceContext) {
      throw new Error(
        "Context not found: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT"
      );
    }

    const newReleaseDate = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_SCHEDULE_MODAL,
      {
        data: {
          releaseDate: workspaceContext.getData()?.releaseDate,
        },
      }
    )
      .then((result) => (result.releaseDate === "" ? null : result.releaseDate))
      .catch(() => {});

    workspaceContext.update({ releaseDate: newReleaseDate ?? null });
  }
}

export { WorkflowReleaseSetScheduleAction as api };
