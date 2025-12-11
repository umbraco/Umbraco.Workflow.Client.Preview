import { WORKFLOW_USER_PERMISSION_CONTENTREVIEW_READ } from "../user-permissions/constants.js";
import {
  WORKFLOW_SECTION_MENU_ALIAS,
  WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "@umbraco-workflow/core";
import {
  WORKFLOW_CONTENTREVIEW_ICON,
  WORKFLOW_CONTENTREVIEW_ENTITY_TYPE,
} from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.ContentReviews",
    name: "Workflow Content Reviews Menu Item",
    weight: 800,
    meta: {
      label: "#workflow_treeHeaders_contentReviews",
      icon: WORKFLOW_CONTENTREVIEW_ICON,
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
      entityType: WORKFLOW_CONTENTREVIEW_ENTITY_TYPE,
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_CONTENTREVIEW_READ,
      },
      {
        alias: WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
        match: "contentReviewsEnabled",
      },
    ],
  },
];
