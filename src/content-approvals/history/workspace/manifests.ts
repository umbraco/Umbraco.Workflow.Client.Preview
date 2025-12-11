import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_HISTORY_COLLECTION_ALIAS } from "../collection/constants.js";
import {
  WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
  WORKFLOW_HISTORY_ROOT_WORKSPACE_ALIAS,
} from "../index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    kind: "default",
    alias: WORKFLOW_HISTORY_ROOT_WORKSPACE_ALIAS,
    name: "Workflow History Root Workspace",
    meta: {
      entityType: WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
      headline: "#workflow_treeHeaders_history",
    },
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "Workflow.WorkspaceView.HistoryRoot.Collection",
    name: "Workflow History Root Collection Workspace View",
    meta: {
      label: "Collection",
      pathname: "collection",
      icon: "icon-layers",
      collectionAlias: WORKFLOW_HISTORY_COLLECTION_ALIAS,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_HISTORY_ROOT_WORKSPACE_ALIAS,
      },
    ],
  },
];
