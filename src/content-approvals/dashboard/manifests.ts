import { manifests as myTasksManifests } from "./my-tasks/manifests.js";
import { manifests as mySubmissionsManifests } from "./my-submissions/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...myTasksManifests,
  ...mySubmissionsManifests,
];
