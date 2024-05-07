import type { ManifestMenuItem } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE } from "../index.js";

const menuItem: ManifestMenuItem = {
  type: "menuItem",
  alias: '"Workflow.MenuItem.ContentReviews',
  name: "Workflow Content Reviews Menu Item",
  weight: 600,
  meta: {
    label: "Content Reviews",
    icon: "icon-binoculars",
    menus: ["Umb.Menu.Workflow"],
    entityType: WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE,
  },
};

export const manifests = [menuItem];
