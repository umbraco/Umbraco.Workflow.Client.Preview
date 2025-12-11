import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbWorkspaceActionBase,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../release-set-workspace.context-token.js";
import { ReleaseSetStatusModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetUnpublishAction extends UmbWorkspaceActionBase<never> {
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

    workspaceContext.updateSetStatus("Draft");
    workspaceContext.submit();
  }
}

export { WorkflowReleaseSetUnpublishAction as api };
