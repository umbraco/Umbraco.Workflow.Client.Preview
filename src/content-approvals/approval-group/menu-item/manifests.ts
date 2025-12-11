import { WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE } from "../constants.js";
import {
  WORKFLOW_USER_PERMISSION_APPROVALGROUP_READ,
  WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE,
} from "../user-permissions/constants.js";
import {
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
  WORKFLOW_SECTION_MENU_ALIAS,
} from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.ApprovalGroups",
    name: "Approval Groups Menu Item",
    weight: 900,
    meta: {
      label: "#workflow_treeHeaders_approvalGroups",
      icon: "icon-users",
      entityType: WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE,
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        oneOf: [
          WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE,
          WORKFLOW_USER_PERMISSION_APPROVALGROUP_READ,
        ],
      },
    ],
  },
];
