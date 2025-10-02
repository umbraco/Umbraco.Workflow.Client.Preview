import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SETTINGS_ENTITY_TYPE, WORKFLOW_SETTINGS_WORKSPACE_ALIAS } from "../constants.js";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT_ALIAS } from "./settings-workspace.context-token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    kind: "routable",
    alias: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
    name: "Workflow Settings Workspace",
    weight: 100,
    api: () => import("./settings-workspace.context.js"),
    meta: {
      entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
    },
  },
  {
    type: "workspaceContext",
    name: "Workflow Settings Workspace Context",
    alias: WORKFLOW_SETTINGS_WORKSPACE_CONTEXT_ALIAS,
    api: () => import("./settings-workspace.context.js"),
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.Settings.General`,
    name: `Workflow Settings Workspace General Settings View`,
    element: () =>
      import("./views/settings-settings-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "#general_general",
      pathname: "general",
      icon: "settings",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.Settings.Notifications`,
    name: `Workflow Settings Workspace Notifications Settings View`,
    element: () =>
      import("./views/settings-notifications-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "#workflow_notifications",
      pathname: "notifications",
      icon: "icon-message",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.Settings.Save",
    name: "Save Settings Workspace Action",
    api: UmbSubmitWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];
