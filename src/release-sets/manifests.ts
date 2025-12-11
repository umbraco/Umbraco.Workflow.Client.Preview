import { UMB_CONTENT_SECTION_ALIAS } from "@umbraco-cms/backoffice/content";
import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as componentManifests } from "./components/manifests.js";
import { manifests as userpermissionsManifests } from "./user-permissions/manifests.js";
import { manifests as calendarManifests } from "./calendar/manifests.js";
import { manifests as settingsManifests } from "./settings/manifests.js";
import {
  WORKFLOW_INITIALIZER_TYPE_ALIAS,
  WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "@umbraco-workflow/core";
import { WORKFLOW_USER_PERMISSION_RELEASESET_READ } from "./user-permissions/index.js";
import { UMB_SECTION_ALIAS_CONDITION_ALIAS } from "@umbraco-cms/backoffice/section";
import { RELEASESET_ENTITY_TYPE } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...repositoryManifests,
  ...collectionManifests,
  ...modalManifests,
  ...workspaceManifests,
  ...componentManifests,
  ...userpermissionsManifests,
  ...calendarManifests,
  ...settingsManifests,
  {
    type: WORKFLOW_INITIALIZER_TYPE_ALIAS,
    alias: "Workflow.Initializer.ReleaseSet",
    name: "Workflow Release Set Workflow Initializer",
    entityType: RELEASESET_ENTITY_TYPE,
    api: () => import("./release-set-workflow-initializer.controller.js"),
  },
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
        alias: UMB_SECTION_ALIAS_CONDITION_ALIAS,
        match: UMB_CONTENT_SECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_READ,
      },
      {
        alias: WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
        match: "releaseSetsEnabled",
      },
    ],
  },
];
