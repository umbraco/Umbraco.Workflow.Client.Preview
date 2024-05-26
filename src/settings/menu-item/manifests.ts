import type { ManifestMenuItem } from "@umbraco-cms/backoffice/extension-registry";

const menuItem: ManifestMenuItem = {
  type: "menuItem",
  alias: "Workflow.MenuItem.Settings",
  name: "Workflow Settings Menu Item",
  weight: 100,
  meta: {
    label: "Settings",
    icon: "icon-settings",
    menus: ["Umb.Menu.Workflow"],
    entityType: "workflow-settings",
  },
};

export const manifests = [menuItem];
