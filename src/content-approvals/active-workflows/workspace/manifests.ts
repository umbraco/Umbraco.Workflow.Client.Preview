import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_ACTIVEWORKFLOWS_ROOT_ENTITY_TYPE,
  WORKFLOW_ACTIVEWORKFLOWS_ROOT_WORKSPACE_ALIAS,
} from "../constants.js";
import { WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_ALIAS } from "../collection/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    kind: "default",
    alias: WORKFLOW_ACTIVEWORKFLOWS_ROOT_WORKSPACE_ALIAS,
    name: "Workflow Active Workflows Root Workspace",
    meta: {
      entityType: WORKFLOW_ACTIVEWORKFLOWS_ROOT_ENTITY_TYPE,
      headline: "#workflow_treeHeaders_active",
    },
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "Workflow.WorkspaceView.ActiveWorkflows.Collection",
    name: "Workflow Active Workflows Root Collection Workspace View",
    meta: {
      label: "Collection",
      pathname: "collection",
      icon: "icon-layers",
      collectionAlias: WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_ALIAS,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ACTIVEWORKFLOWS_ROOT_WORKSPACE_ALIAS,
      },
    ],
  },
];
