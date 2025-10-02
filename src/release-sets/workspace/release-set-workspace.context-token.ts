import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowReleaseSetWorkspaceContext } from "./release-set-workspace.context.js";

export const WORKFLOW_RELEASESET_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSubmittableWorkspaceContext,
  WorkflowReleaseSetWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowReleaseSetWorkspaceContext =>
    (context as WorkflowReleaseSetWorkspaceContext)
      .IS_RELEASESET_WORKSPACE_CONTEXT
);
