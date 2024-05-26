import { manifests as dashboardManifests } from "./dashboards/manifests.js";
import { manifests as sectionManifests } from "./section.manifests.js";
import { manifests as workspaceEditorViewManifests } from "./editor-view/manifests.js";
import { manifests as coreManifests } from "./core/manifests.js";
import { manifests as advancedSearchManifests } from "./advanced-search/manifests.js";

export const manifests = [
  ...dashboardManifests,
  ...sectionManifests,
  ...workspaceEditorViewManifests,
  ...coreManifests,
  ...advancedSearchManifests,
];
