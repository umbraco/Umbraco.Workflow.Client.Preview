import { WORKFLOW_SECTION_MENU_ALIAS } from '../../constants.js';
import { WORKFLOW_HISTORY_ROOT_ENTITY_TYPE } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.History",
    name: "Workflow Settings Menu Item",
    weight: 700,
    meta: {
      label: "#workflow_treeHeaders_history",
      icon: "icon-alarm-clock",
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
      entityType: WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
    },
  },
];
