import { manifests as releaseSetItemManifests } from "./release-set-items/manifests.js";
import { manifests as releaseSetTaskManifests } from "./release-set-tasks/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...releaseSetItemManifests,
  ...releaseSetTaskManifests,
];
