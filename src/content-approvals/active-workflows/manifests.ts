import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as menuItemManifests } from "./menu-item/manifests.js";
import { manifests as userPermissionManifests } from "./user-permissions/manifests.js";
import { manifests as entitySignManifests } from "./entity-sign/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...workspaceManifests,
  ...menuItemManifests,
  ...userPermissionManifests,
  ...entitySignManifests,
  ...collectionManifests,
];
