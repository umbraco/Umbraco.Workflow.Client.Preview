import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowContentReviewsSettingsWorkspaceContext } from "./content-reviews-settings-workspace.context.js";
import { WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT_ALIAS } from "./constants.js";
import { WORKFLOW_CONTENTREVIEWS_SETTINGS_ENTITY_TYPE } from "../constants.js";

export const WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT =
  new UmbContextToken<
    UmbSubmittableWorkspaceContext,
    WorkflowContentReviewsSettingsWorkspaceContext
  >(
    WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT_ALIAS,
    undefined,
    (context): context is WorkflowContentReviewsSettingsWorkspaceContext =>
      context.getUnique() === WORKFLOW_CONTENTREVIEWS_SETTINGS_ENTITY_TYPE
  );
