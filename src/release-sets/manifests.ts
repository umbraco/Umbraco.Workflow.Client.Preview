import { UMB_CONTENT_SECTION_ALIAS } from "@umbraco-cms/backoffice/content";
import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as componentManifests } from "./components/manifests.js";
import { manifests as userpermissionsManifests } from "./user-permissions/manifests.js";
import { manifests as calendarManifests } from "./calendar/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...repositoryManifests,
  ...collectionManifests,
  ...modalManifests,
  ...workspaceManifests,
  ...componentManifests,
  ...userpermissionsManifests,
  ...calendarManifests,
  {
    type: "dashboard",
    alias: "Workflow.ReleaseSets.Dashboard",
    name: "Workflow Release Sets Dashboard",
    weight: 100,
    element: () => import("./release-sets-dashboard.element.js"),
    meta: {
      label: "#workflow_releaseSets",
      pathname: "release-sets",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: UMB_CONTENT_SECTION_ALIAS,
      },
    ],
  },
];
