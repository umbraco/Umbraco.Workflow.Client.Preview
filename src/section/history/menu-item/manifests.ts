import type { ManifestMenuItem } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_HISTORY_ROOT_ENTITY_TYPE } from "../index.js";

const menuItem: ManifestMenuItem = {
	type: 'menuItem',
	alias: '"Workflow.MenuItem.History',
	name: 'Workflow Settings Menu Item',
	weight: 600,
	meta: {
		label: 'History',
		icon: 'icon-alarm-clock',
		menus: ["Umb.Menu.Workflow"],
		entityType: WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
	}
};
 
export const manifests = [menuItem];