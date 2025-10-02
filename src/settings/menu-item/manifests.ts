import { WORKFLOW_SECTION_MENU_ALIAS } from '../../constants.js';
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from '../constants.js';

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.Settings",
    name: "Workflow Settings Menu Item",
    weight: 600,
    meta: {
      label: "#workflow_treeHeaders_settings",
      icon: "icon-settings",
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
      entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
    },
  },
];
