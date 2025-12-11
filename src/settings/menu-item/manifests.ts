import { UMB_ADVANCED_SETTINGS_MENU_ALIAS } from "@umbraco-cms/backoffice/settings";
import { WORKFLOW_SETTINGS_TREE_ALIAS } from "../tree/constants.js";
import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SETTINGS_MENU_ITEM_ALIAS } from "./constants.js";
import { WORKFLOW_SETTINGS_WORKSPACE_ALIAS } from "../workspace/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    kind: "tree",
    alias: WORKFLOW_SETTINGS_MENU_ITEM_ALIAS,
    name: "Workflow Settings Menu Item",
    weight: 10,
    meta: {
      label: "#workflow_workflow",
      menus: [UMB_ADVANCED_SETTINGS_MENU_ALIAS],
      treeAlias: WORKFLOW_SETTINGS_TREE_ALIAS,
    },
  },
  {
    type: "workspaceContext",
    kind: "menuStructure",
    name: "Workflow Settings Menu Structure Workspace Context",
    alias: "Workflow.Context.Settings.Menu.Structure",
    api: () => import("./settings-menu-structure.context.js"),
    meta: {
      menuItemAlias: WORKFLOW_SETTINGS_MENU_ITEM_ALIAS,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
      },
    ],
  },
];
