import { UMB_CONTENT_SECTION_ALIAS } from "@umbraco-cms/backoffice/content";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as userPermissionsManifests } from "./user-permissions/manifests.js";
import { WORKFLOW_USER_PERMISSION_ADVANCEDSEARCH_READ } from "./user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";
import { UMB_SECTION_ALIAS_CONDITION_ALIAS } from "@umbraco-cms/backoffice/section";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "dashboard",
    alias: "Workflow.AdvancedSearch.Dashboard",
    name: "Workflow Advanced Search Dashboard",
    weight: 100,
    element: () => import("./advanced-search.dashboard.element.js"),
    meta: {
      label: "#workflow_search_advancedSearch",
      pathname: "advanced-search",
    },
    conditions: [
      {
        alias: UMB_SECTION_ALIAS_CONDITION_ALIAS,
        match: UMB_CONTENT_SECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_ADVANCEDSEARCH_READ,
      },
    ],
  },
  ...modalManifests,
  ...userPermissionsManifests,
];
