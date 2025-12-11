import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../constants.js";
import {
  WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE,
  WORKFLOW_SETTINGS_ROOT_WORKSPACE_ALIAS,
  WORKFLOW_SETTINGS_TREE_ALIAS,
  WORKFLOW_SETTINGS_TREE_REPOSITORY_ALIAS,
} from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_SETTINGS_TREE_REPOSITORY_ALIAS,
    name: "Workflow Settings Tree Repository",
    api: () => import("./settings-tree.repository.js"),
  },
  {
    type: "tree",
    kind: "default",
    alias: WORKFLOW_SETTINGS_TREE_ALIAS,
    name: "Workflow Settings Tree",
    meta: {
      repositoryAlias: WORKFLOW_SETTINGS_TREE_REPOSITORY_ALIAS,
    },
  },
  {
    type: "treeItem",
    kind: "default",
    alias: "Workflow.TreeItem.Settings",
    name: "Workflow Settings Tree Item",
    forEntityTypes: [
      WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE,
      WORKFLOW_SETTINGS_ENTITY_TYPE,
    ],
  },
  {
    type: "workspace",
    kind: "default",
    alias: WORKFLOW_SETTINGS_ROOT_WORKSPACE_ALIAS,
    name: "Workflow Settings Root Workspace",
    meta: {
      entityType: WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE,
      headline: "#workflow_workflow",
    },
  },
];
