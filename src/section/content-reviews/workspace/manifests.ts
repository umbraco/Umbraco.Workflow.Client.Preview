import type {
  ManifestWorkspace,
  ManifestWorkspaceAction,
  ManifestWorkspaceView,
} from "@umbraco-cms/backoffice/extension-registry";
import { UmbSaveWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE } from "../index.js";
import { WorkflowRegenerateContentReviewsWorkspaceAction } from "./actions/save-and-regenerate.action.js";

const workspaceAlias = "Umb.Workspace.Workflow.ContentReviews";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: workspaceAlias,
  name: "Content Reviews Root Workspace",
  js: () => import("./content-reviews-root-workspace.element.js"),
  meta: {
    entityType: WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE,
  },
};

const workspaceViews: Array<ManifestWorkspaceView> = [
  {
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.ContentReviews.Overview`,
    name: `Workflow Content Reviews Workspace Overview View`,
    js: () =>
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
        match: workspaceAlias,
      },
    ],
  },
  {
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.ContentViews.Settings`,
    name: `Workflow Content Reviews Workspace Settings View`,
    js: () =>
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
        match: workspaceAlias,
      },
    ],
  },
];

const workspaceActions: Array<ManifestWorkspaceAction> = [
  {
    type: "workspaceAction",
    alias: "Umb.WorkspaceAction.Workflow.ContentReviews.Save",
    name: "Save Content Reviews Settings Workspace Action",
    api: UmbSaveWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "Save",
    },
    weight: 100,
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: workspaceAlias,
      },
    ],
  },
  {
    type: "workspaceAction",
    alias: "Umb.WorkspaceAction.Workflow.ContentReviews.Regenerate",
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
        match: workspaceAlias,
      },
    ],
  },
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
