import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowSettingsWorkspaceContext } from "./settings-workspace.context.js";

export const WORKFLOW_SETTINGS_WORKSPACE_CONTEXT_ALIAS = "WorkflowSettingsContext";

export const WORKFLOW_SETTINGS_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSubmittableWorkspaceContext,
  WorkflowSettingsWorkspaceContext
>(
  WORKFLOW_SETTINGS_WORKSPACE_CONTEXT_ALIAS,
  undefined,
  (context): context is WorkflowSettingsWorkspaceContext =>
    (context as WorkflowSettingsWorkspaceContext)
      .IS_WORKFLOW_SETTINGS_WORKSPACE_CONTEXT
);
