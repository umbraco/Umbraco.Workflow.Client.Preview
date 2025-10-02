import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowAlternateVersionWorkspaceContext } from "./alternate-version-workspace.context.js";

export const WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSubmittableWorkspaceContext,
  WorkflowAlternateVersionWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowAlternateVersionWorkspaceContext =>
    (context as WorkflowAlternateVersionWorkspaceContext)
      .IS_ALTERNATEVERSION_WORKSPACE_CONTEXT
);
