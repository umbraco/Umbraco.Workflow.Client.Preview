import { WORKFLOW_SECTION_MENU_ALIAS } from '../../constants.js';
import { ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE } from '../constants.js';

export const manifests: Array<UmbExtensionManifest> = [{
  type: "menuItem",
  alias: "Workflow.MenuItem.ActiveWorkflows",
  name: "Active Workflows Menu Item",
  weight: 1000,
  meta: {
    label: "#workflow_treeHeaders_active",
    icon: "icon-nodes",
    entityType: ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE,
    menus: [WORKFLOW_SECTION_MENU_ALIAS],
  },
}];
