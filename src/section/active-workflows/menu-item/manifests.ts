import type { ManifestMenuItem } from '@umbraco-cms/backoffice/extension-registry';
import { ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE } from '../index.js';

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: 'Umb.MenuItem.Workflow.ActiveWorkflows',
	name: 'Active Workflows Menu Item',
	weight: 1000,
	meta: {
		label: 'Active Workflows',
		icon: 'icon-nodes',
		entityType: ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE,
		menus: ["Umb.Menu.Workflow"],
	}
};

export const manifests = [menuItem];