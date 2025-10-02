import { WORKFLOW_SECTION_MENU_ALIAS } from '../../constants.js';
import { WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.ContentReviews",
    name: "Workflow Content Reviews Menu Item",
    weight: 800,
    meta: {
      label: "#workflow_treeHeaders_contentReviews",
      icon: "icon-binoculars",
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
      entityType: WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE,
    },
  },
];
