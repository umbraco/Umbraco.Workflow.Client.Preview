import { manifests as contextManifests } from "./context/manifests.js";
import { manifests as langManifests } from "./lang/manifests.js";
import { manifests as componentManifests } from "./components/manifests.js";

export const manifests = [
  ...contextManifests,
  ...langManifests,
  ...componentManifests,
];
