import type {
  ManifestWorkspaces,
  ManifestWorkspaceAction,
  ManifestWorkspaceViews,
} from "@umbraco-cms/backoffice/extension-registry";
import { UmbSaveWorkspaceAction } from "@umbraco-cms/backoffice/workspace";

export const WORKFLOW_SETTINGS_WORKSPACE_ALIAS = "Workflow.Workspace.Settings";

const workspace: ManifestWorkspaces = {
  type: "workspace",
  kind: "routable",
  alias: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
  name: "Workflow Settings Workspace",
  api: () => import("./settings-workspace.context.js"),
  meta: {
    entityType: "workflow-settings",
  },
};

const workspaceViews: Array<ManifestWorkspaceViews> = [
  {
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.Settings.General`,
    name: `Workflow Settings Workspace General Settings View`,
    element: () =>
      import("./views/settings-settings-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "General",
      pathname: "general",
      icon: "settings",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.Settings.Notifications`,
    name: `Workflow Settings Workspace Notifications Settings View`,
    element: () =>
      import("./views/settings-notifications-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "Notifications",
      pathname: "notifications",
      icon: "icon-message",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];

const workspaceActions: Array<ManifestWorkspaceAction> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.Settings.Save",
    name: "Save Settings Workspace Action",
    api: UmbSaveWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
