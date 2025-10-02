import { manifests as contextManifests } from "./context/manifests.js";
import { manifests as langManifests } from "./lang/manifests.js";
import { manifests as componentManifests } from "./components/manifests.js";
import { manifests as initializerManifests } from "./initializers/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as conditionManifests } from "./conditions/manifests.js";

export const manifests = [
  ...contextManifests,
  ...langManifests,
  ...componentManifests,
  ...initializerManifests,
  ...modalManifests,
  ...conditionManifests,
];
