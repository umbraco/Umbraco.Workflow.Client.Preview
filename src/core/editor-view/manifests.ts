import {
  UMB_DOCUMENT_ENTITY_TYPE,
  UMB_DOCUMENT_WORKSPACE_ALIAS,
} from "@umbraco-cms/backoffice/document";
import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { manifests as componentManifests } from "./components/manifests.js";
import { WORKFLOW_USER_PERMISSION_HISTORY_READ } from "@umbraco-workflow/history";
import { WORKFLOW_RELEASESET_WORKSPACE_ALIAS } from "@umbraco-workflow/release-sets";
import { WORKFLOW_ICON, WORKFLOW_SECTION_PATHNAME } from "../constants.js";
import {
  WORKFLOW_ENTITY_IS_NEW_VISIBILITY_CONDITION,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "../conditions/index.js";
import {
  WORKFLOW_USER_PERMISSION_CONFIGURATION_READ,
  WORKFLOW_USER_PERMISSION_CONFIGURATION_UPDATE,
} from "../user-permissions/constants.js";
import { WORKFLOW_WORKSPACE_TAB } from "../types.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceView",
    kind: "contentEditor",
    name: "Document Workspace Workflow View",
    alias: "Workflow.WorkspaceView.Document",
    element: () => import("./workflow-workspace-editor-view.js"),
    weight: 110,
    meta: {
      label: "#workflow_workflow",
      pathname: WORKFLOW_SECTION_PATHNAME,
      icon: WORKFLOW_ICON,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        oneOf: [
          UMB_DOCUMENT_WORKSPACE_ALIAS,
          WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
        ],
      },
      {
        alias: WORKFLOW_ENTITY_IS_NEW_VISIBILITY_CONDITION,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        oneOf: [
          WORKFLOW_USER_PERMISSION_CONFIGURATION_READ,
          WORKFLOW_USER_PERMISSION_CONFIGURATION_UPDATE,
        ],
      },
    ],
  },
  {
    type: WORKFLOW_WORKSPACE_TAB,
    alias: "Workflow.EditorView.WorkspaceTab.Config",
    name: "Workflow Editor View Config Tab",
    element: () => import("./views/config/config.element.js"),
    forEntityType: UMB_DOCUMENT_ENTITY_TYPE,
    meta: {
      label: "#workflow_configuration",
      pathname: "configuration",
      icon: "",
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_CONFIGURATION_READ,
      },
    ],
  },
  {
    type: WORKFLOW_WORKSPACE_TAB,
    alias: "Workflow.EditorView.WorkspaceTab.History",
    name: "Workflow Editor View History Tab",
    element: () => import("./views/history/history.element.js"),
    forEntityType: UMB_DOCUMENT_ENTITY_TYPE,
    meta: {
      label: "#workflow_history",
      pathname: "history",
      icon: "",
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_HISTORY_READ,
      },
    ],
  },
  ...componentManifests,
];
