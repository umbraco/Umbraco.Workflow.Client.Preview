import type {
  ManifestWorkspaces,
  ManifestWorkspaceActions,
  ManifestWorkspaceView,
} from "@umbraco-cms/backoffice/extension-registry";
import { UmbSaveWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import { WorkflowRegenerateContentReviewsWorkspaceAction } from "./actions/save-and-regenerate.action.js";

export const WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE = "content-reviews";
export const WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS =
  "Workflow.Workspace.ContentReviews";

const workspace: ManifestWorkspaces = {
  type: "workspace",
  kind: "routable",
  alias: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
  name: "Content Reviews Root Workspace",
  api: () => import("./content-reviews-workspace.context.js"),
  meta: {
    entityType: "content-reviews",
  },
};

const workspaceViews: Array<ManifestWorkspaceView> = [
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.ContentReviews.Overview`,
    name: `Workflow Content Reviews Workspace Overview View`,
    element: () =>
      import("./views/content-reviews-overview-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "Overview",
      pathname: "overview",
      icon: "info",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
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
      label: "Settings",
      pathname: "settings",
      icon: "settings",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
      },
    ],
  },
];

const workspaceActions: Array<ManifestWorkspaceActions> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ContentReviews.Save",
    name: "Save Content Reviews Settings Workspace Action",
    api: UmbSaveWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    weight: 100,
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ContentReviews.Regenerate",
    name: "Regenerate Content Reviews Settings Workspace Action",
    api: WorkflowRegenerateContentReviewsWorkspaceAction,
    meta: {
      look: "primary",
      color: "default",
      label: "Save and regenerate",
    },
    weight: 200,
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
      },
    ],
  },
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
