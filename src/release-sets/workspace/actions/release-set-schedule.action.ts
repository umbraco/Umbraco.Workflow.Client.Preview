import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbWorkspaceActionBase,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../release-set-workspace.context-token.js";
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
      throw new Error("Context not found: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT");
    }

    const releaseDate = workspaceContext.getData()?.releaseDate;

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) {
      throw new Error("Context not found: UMB_MODAL_MANAGER_CONTEXT");
    }
    
    const modalHandler = modalContext.open(
      this,
      WORKFLOW_RELEASESET_SCHEDULE_MODAL,
      {
        data: {
          releaseDate,
        },
      }
    );

    await modalHandler.onSubmit().catch(() => {});
    const value = modalHandler.getValue();

    let newReleaseDate = value?.releaseDate ?? null;
    newReleaseDate = newReleaseDate === "" ? null : newReleaseDate;

    workspaceContext.update({ releaseDate: newReleaseDate });
  }
}

export { WorkflowReleaseSetScheduleAction as api };
