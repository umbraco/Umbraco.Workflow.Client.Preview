import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_RELEASESET_SETTINGS_ENTITY_TYPE,
  WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_ALIAS,
} from "../../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workflowSettingsWorkspaceProvider",
    alias: WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_ALIAS,
    name: "Workflow Release Sets Settings Workspace",
    weight: 800,
    api: () => import("./settings-workspace.context.js"),
    meta: {
      entityType: WORKFLOW_RELEASESET_SETTINGS_ENTITY_TYPE,
      label: "#workflow_treeHeaders_releaseSets",
    },
  },
  {
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.ReleaseSetSettings.General`,
    name: `Workflow Release Set Settings Workspace General Settings View`,
    element: () => import("./views/settings-workspace-view.element.js"),
    weight: 90,
    meta: {
      label: "#general_general",
      pathname: "general",
      icon: "settings",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ReleaseSetSettings.Save",
    name: "Save Release SetSettings Workspace Action",
    api: UmbSubmitWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];
