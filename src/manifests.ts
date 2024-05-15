import { manifests as dashboardManifests } from "./dashboards/manifests.js";
import { manifests as sectionManifests } from "./section/section.manifests.js";
import { manifests as workspaceEditorViewManifests } from "./editor-view/manifests.js";
import { manifests as localizationManifests } from "./lang/manifests.js";
import { manifests as componentManifests } from "./components/manifests.js";

export const manifests = [
  ...dashboardManifests,
  ...sectionManifests,
  ...workspaceEditorViewManifests,
  ...localizationManifests,
  ...componentManifests,
];
