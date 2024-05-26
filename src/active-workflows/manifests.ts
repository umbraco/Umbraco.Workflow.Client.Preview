import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { manifests as menuItems } from "./menu-item/manifests.js";

export const manifests = [...workspaceManifests, ...menuItems];
