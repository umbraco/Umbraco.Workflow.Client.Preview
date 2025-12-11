import { manifests as conditionManifests } from "./conditions/manifests.js";
import { manifests as actionManifests } from "./actions/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as userPermissionManifests } from "./user-permissions/manifests.js";

export const manifests = [
  ...conditionManifests,
  ...actionManifests,
  ...modalManifests,
  ...userPermissionManifests,
];
