import type {
  ManifestWorkspace,
  ManifestWorkspaceAction,
  ManifestWorkspaceView,
} from "@umbraco-cms/backoffice/extension-registry";
import { UmbSaveWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../index.js";

const workspaceAlias = "Workflow.Workspace.Settings";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: workspaceAlias,
  name: "Workflow Settings Root Workspace",
  js: () => import("./settings-root-workspace.element.js"),
  meta: {
    entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
  },
};

const workspaceViews: Array<ManifestWorkspaceView> = [
  {
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.Settings.General`,
    name: `Workflow Settings Workspace General Settings View`,
    js: () => import("./views/settings-settings-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "General",
      pathname: "general",
      icon: "settings",
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
    alias: `Umb.WorkspaceView.Workflow.Settings.Notifications`,
    name: `Workflow Settings Workspace Notifications Settings View`,
    js: () =>
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
        match: workspaceAlias,
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
      label: "Save",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: workspaceAlias,
      },
    ],
  },
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
