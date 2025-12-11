import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowReleaseSetSettingsWorkspaceContext } from "./settings-workspace.context.js";
import { WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT_ALIAS } from "./constants.js";
import { WORKFLOW_RELEASESET_SETTINGS_ENTITY_TYPE } from "../../constants.js";

export const WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT =
  new UmbContextToken<
    UmbSubmittableWorkspaceContext,
    WorkflowReleaseSetSettingsWorkspaceContext
  >(
    WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT_ALIAS,
    undefined,
    (context): context is WorkflowReleaseSetSettingsWorkspaceContext =>
      context.getUnique() === WORKFLOW_RELEASESET_SETTINGS_ENTITY_TYPE
  );
