import { manifests as treeManifests } from "./menu-item/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as historyCleanupManifests } from "./history-cleanup/manifests.js";

export const manifests = [
  ...treeManifests,
  ...workspaceManifests,
  ...historyCleanupManifests,
];
