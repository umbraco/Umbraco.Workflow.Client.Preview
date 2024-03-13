import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extension-registry';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.Workflow.ApprovalGroups',
	name: 'Approval Groups Menu Item',
	weight: 600,
	meta: {
		label: 'Approval Groups',
		icon: 'icon-users',
		entityType: "approval-group-root",
		menus: ["Umb.Menu.Workflow"],
	}
};
 
export const manifests = [menuItem];