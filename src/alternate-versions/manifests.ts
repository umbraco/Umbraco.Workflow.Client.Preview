import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as workspaceViewManifests } from "./editor-view/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as entityActionManifests } from "./entity-actions/manifests.js";
import { manifests as userPermissionsManifests } from "./user-permissions/manifests.js";
import { WORKFLOW_INITIALIZER_TYPE_ALIAS } from "@umbraco-workflow/core";
import { ALTERNATEVERSION_ENTITY_TYPE } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...modalManifests,
  ...workspaceViewManifests,
  ...collectionManifests,
  ...repositoryManifests,
  ...workspaceManifests,
  ...entityActionManifests,
  ...userPermissionsManifests,
  {
    type: WORKFLOW_INITIALIZER_TYPE_ALIAS,
    alias: "Workflow.Initializer.AlternateVersion",
    name: "Workflow Alternate Version Workflow Initializer",
    entityType: ALTERNATEVERSION_ENTITY_TYPE,
    api: () => import("./alternate-version-workflow-initializer.controller.js"),
  },
];
