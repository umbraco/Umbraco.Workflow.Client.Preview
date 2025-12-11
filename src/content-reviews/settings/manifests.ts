import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";

export const manifests = [...workspaceManifests, ...modalManifests];
