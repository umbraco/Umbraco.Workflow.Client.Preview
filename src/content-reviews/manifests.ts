import { manifests as repositoryManifests } from "./settings/repository/manifests.js";
import { manifests as treeManifests } from "./menu-item/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as actionManifests } from "./actions/manifests.js";
import { manifests as conditionManifests } from "./conditions/manifests.js";
import { manifests as entitySignManifests } from "./entity-sign/manifests.js";
import { manifests as userPermissionManifests } from "./user-permissions/manifests.js";
import { manifests as settingsManifests } from "./settings/manifests.js";
import { manifests as collectionManifests } from "./collection/manifests.js";
import { manifests as dashboardManifests } from "./dashboard/manifests.js";

export const manifests = [
  ...repositoryManifests,
  ...treeManifests,
  ...workspaceManifests,
  ...modalManifests,
  ...actionManifests,
  ...conditionManifests,
  ...userPermissionManifests,
  ...settingsManifests,
  ...entitySignManifests,
  ...collectionManifests,
  ...dashboardManifests,
];
