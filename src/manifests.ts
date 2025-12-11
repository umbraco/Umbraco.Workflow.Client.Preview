import { manifests as dashboardManifests } from "./dashboards/manifests.js";
import { manifests as sectionManifests } from "./section.manifests.js";
import { manifests as coreManifests } from "./core/manifests.js";
import { manifests as settingsManifests } from "./settings/manifests.js";

export const manifests = [
  ...dashboardManifests,
  ...sectionManifests,
  ...coreManifests,
  ...settingsManifests,
];
