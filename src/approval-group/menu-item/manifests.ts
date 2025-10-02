import { WORKFLOW_SECTION_MENU_ALIAS } from '../../constants.js';

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "menuItem",
    alias: "Workflow.MenuItem.ApprovalGroups",
    name: "Approval Groups Menu Item",
    weight: 900,
    meta: {
      label: "#workflow_treeHeaders_approvalGroups",
      icon: "icon-users",
      entityType: "approval-group-root",
      menus: [WORKFLOW_SECTION_MENU_ALIAS],
    },
  },
];
