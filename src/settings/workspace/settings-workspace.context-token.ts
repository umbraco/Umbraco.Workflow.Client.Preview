import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import { WorkflowSettingsWorkspaceContext } from "./settings-workspace.context";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../constants";

export const WORKFLOW_SETTINGS_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSubmittableWorkspaceContext,
  WorkflowSettingsWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowSettingsWorkspaceContext =>
    context.getEntityType?.() === WORKFLOW_SETTINGS_ENTITY_TYPE
);
