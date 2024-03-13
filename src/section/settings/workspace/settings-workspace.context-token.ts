import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSaveableWorkspaceContextInterface } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowSettingsWorkspaceContext } from "./settings-workspace.context.js";

export const WORKFLOW_SETTINGS_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSaveableWorkspaceContextInterface,
  WorkflowSettingsWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowSettingsWorkspaceContext =>
    (context as WorkflowSettingsWorkspaceContext).IS_WORKFLOW_SETTINGS_WORKSPACE_CONTEXT
);
