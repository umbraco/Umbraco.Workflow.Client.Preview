import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as workspaceViewManifests } from "./editor-view/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as entityActionManifests } from "./entity-actions/manifests.js";
import { manifests as userPermissionsManifests } from "./user-permissions/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...modalManifests,
  ...workspaceViewManifests,
  ...collectionManifests,
  ...repositoryManifests,
  ...workspaceManifests,
  ...entityActionManifests,
  ...userPermissionsManifests,
  {
      type: "workflowInitializer",
      alias: "Workflow.Initializer.AlternateVersion",
      name: "Workflow Alternate Version Workflow Initializer",
      entityType: "alternate-version",
      api: () => import('./alternate-version-workflow-initializer.controller.js'),
  },
];
