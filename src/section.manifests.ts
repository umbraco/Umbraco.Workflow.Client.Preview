import type {
  ManifestMenu,
  ManifestSectionSidebarAppMenuKind,
  ManifestSection,
} from "@umbraco-cms/backoffice/extension-registry";

import { manifests as approvalGroupsManifests } from "./approval-group/manifests.js";
import { manifests as activeWorkflowsManifests } from "./active-workflows/manifests.js";
import { manifests as settingsManifests } from "./settings/manifests.js";
import { manifests as historyManifests } from "./history/manifests.js";
import { manifests as contentReviewsManifests } from "./content-reviews/manifests.js";

const sectionAlias = "Umb.Section.Workflow";
const menuAlias = "Umb.Menu.Workflow";

const section: ManifestSection = {
  type: "section",
  alias: sectionAlias,
  name: "Workflow Section",
  weight: 0,
  meta: {
    label: "Workflow",
    pathname: "workflow",
  },
};

const menu: ManifestMenu = {
  type: "menu",
  alias: menuAlias,
  name: "Workflow Menu",
  meta: {
    label: "Workflow",
  },
};

const menuSectionSidebarApp: ManifestSectionSidebarAppMenuKind = {
  type: "sectionSidebarApp",
  kind: "menu",
  alias: "Umb.SectionSidebarMenu.Workflow",
  name: "Workflow Section Sidebar Menu",
  weight: 200,
  meta: {
    label: "Workflow",
    menu: menuAlias,
  },
  conditions: [
    {
      alias: "Umb.Condition.SectionAlias",
      match: sectionAlias,
    },
  ],
};

export const manifests = [
  section,
  menu,
  menuSectionSidebarApp,
  ...activeWorkflowsManifests,
  ...approvalGroupsManifests,
  ...settingsManifests,
  ...historyManifests,
  ...contentReviewsManifests,
];
