import { WORKFLOW_ACTIVEWORKFLOWS_ROOT_ENTITY_TYPE } from "../constants.js";
import { WORKFLOW_USER_PERMISSION_ACTIVEWORKFLOWS_READ } from "../user-permissions/constants.js";
import {
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
  WORKFLOW_SECTION_MENU_ALIAS,
} from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.ActiveWorkflows",
    name: "Active Workflows Menu Item",
    weight: 1000,
    meta: {
      label: "#workflow_treeHeaders_active",
      icon: "icon-nodes",
      entityType: WORKFLOW_ACTIVEWORKFLOWS_ROOT_ENTITY_TYPE,
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_ACTIVEWORKFLOWS_READ,
      },
    ],
  },
];
