import type { ManifestMenuItem } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../index.js";

const menuItem: ManifestMenuItem = {
  type: "menuItem",
  alias: '"Workflow.MenuItem.Settings',
  name: "Workflow Settings Menu Item",
  weight: 100,
  meta: {
    label: "Settings",
    icon: "icon-settings",
    menus: ["Umb.Menu.Workflow"],
    entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
  },
};

export const manifests = [menuItem];
