import { UMB_CONTENT_SECTION_ALIAS } from "@umbraco-cms/backoffice/content";
import { manifests as modalManifests } from "./modal/manifests.js";
import { UMB_SECTION_ALIAS_CONDITION_ALIAS } from "@umbraco-cms/backoffice/section";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "dashboard",
    alias: "Workflow.AdvancedSearch.Dashboard",
    name: "Workflow Advanced Search Dashboard",
    weight: 100,
    element: () => import("./advanced-search.dashboard.element.js"),
    meta: {
      label: "#workflowSearch_advancedSearch",
      pathname: "advanced-search",
    },
    conditions: [
      {
        alias: UMB_SECTION_ALIAS_CONDITION_ALIAS,
        match: UMB_CONTENT_SECTION_ALIAS,
      },
    ],
  },
  ...modalManifests,
];
