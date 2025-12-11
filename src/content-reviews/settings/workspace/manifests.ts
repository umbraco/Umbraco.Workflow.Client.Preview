import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_CONTENTREVIEWS_SETTINGS_ENTITY_TYPE,
  WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
} from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workflowSettingsWorkspaceProvider",
    alias: WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
    name: "Content Reviews Settings Workspace",
    api: () => import("./content-reviews-settings-workspace.context.js"),
    weight: 900,
    meta: {
      entityType: WORKFLOW_CONTENTREVIEWS_SETTINGS_ENTITY_TYPE,
      label: "#workflow_treeHeaders_contentReviews",
    },
  },
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.ContentReviews.Settings`,
    name: `Workflow Content Reviews Workspace Settings View`,
    element: () =>
      import("./views/content-reviews-settings-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "#general_settings",
      pathname: "settings",
      icon: "settings",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ContentReviews.Save",
    name: "Save Content Reviews Settings Workspace Action",
    api: UmbSubmitWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    weight: 100,
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ContentReviews.Regenerate",
    name: "Regenerate Content Reviews Settings Workspace Action",
    api: () => import("./actions/save-and-regenerate.action.js"),
    meta: {
      look: "primary",
      color: "default",
      label: "#workflow_contentReviews_saveAndRegenerate",
    },
    weight: 200,
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];
