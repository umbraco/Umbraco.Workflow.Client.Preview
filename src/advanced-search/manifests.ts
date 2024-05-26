import type { ManifestDashboard } from "@umbraco-cms/backoffice/extension-registry";
import { manifests as modalManifests } from './modal/manifests.js';

const dashboard: ManifestDashboard = {
  type: "dashboard",
  alias: "workflow.advancedsearch.dashboard",
  name: "Workflow Advanced Search Dashboard",
  elementName: "workflow-advanced-search-dashboard",
  weight: 100,
  element: () => import("./advanced-search.dashboard.element.js"),
  meta: {
    label: "Advanced Search",
    pathname: "advanced-search",
  },
  conditions: [
    {
      alias: "Umb.Condition.SectionAlias",
      match: "Umb.Section.Content",
    },
  ],
};
export const manifests = [dashboard, ...modalManifests];
