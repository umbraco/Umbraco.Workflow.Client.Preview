import {
  WORKFLOW_HISTORY_ICON,
  WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
} from "../constants.js";
import { WORKFLOW_USER_PERMISSION_HISTORY_READ } from "../user-permissions/constants.js";
import {
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
  WORKFLOW_SECTION_MENU_ALIAS,
} from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.History",
    name: "Workflow Settings Menu Item",
    weight: 700,
    meta: {
      label: "#workflow_treeHeaders_history",
      icon: WORKFLOW_HISTORY_ICON,
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
      entityType: WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_HISTORY_READ,
      },
    ],
  },
];
