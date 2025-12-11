import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_CONTENTAPPROVAL_SETTINGS_ENTITY_TYPE,
  WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
} from "../constants.js";
import { WORKFLOW_SETTINGS_ICON } from "@umbraco-workflow/settings";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workflowSettingsWorkspaceProvider",
    alias: WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
    name: "Workflow Content Approvals Settings Workspace",
    weight: 1000,
    api: () => import("./settings-workspace.context.js"),
    meta: {
      entityType: WORKFLOW_CONTENTAPPROVAL_SETTINGS_ENTITY_TYPE,
      label: "#workflow_treeHeaders_contentApproval",
    },
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
      icon: WORKFLOW_SETTINGS_ICON,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
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
        match: WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
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
        match: WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];
