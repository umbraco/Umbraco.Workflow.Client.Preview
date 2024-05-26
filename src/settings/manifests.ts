import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as treeManifests } from "./menu-item/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as componentManifests } from "./components/manifests.js";

export const manifests = [
  ...repositoryManifests,
  ...treeManifests,
  ...workspaceManifests,
  ...componentManifests,
];
