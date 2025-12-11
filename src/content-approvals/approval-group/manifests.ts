import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as treeManifests } from "./menu-item/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as approvalGrouPickerManifests } from "./approval-group-picker/manifests.js";
import { manifests as userPermissionsManifests } from "./user-permissions/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...repositoryManifests,
  ...treeManifests,
  ...workspaceManifests,
  ...collectionManifests,
  ...modalManifests,
  ...approvalGrouPickerManifests,
  ...userPermissionsManifests,
];
