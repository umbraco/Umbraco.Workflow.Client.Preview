import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE, WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.ContentReviews.Overview`,
    name: `Workflow Content Reviews Workspace Overview View`,
    element: () =>
      import("./views/content-reviews-overview-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "#workflow_overview",
      pathname: "overview",
      icon: "info",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.ContentViews.Settings`,
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
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
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
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
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
      label: "#contentReviews_saveAndRegenerate",
    },
    weight: 200,
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspace",
    kind: "routable",
    alias: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
    name: "Content Reviews Root Workspace",
    api: () => import("./content-reviews-workspace.context.js"),
    meta: {
      entityType: WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE,
    },
  },
];
