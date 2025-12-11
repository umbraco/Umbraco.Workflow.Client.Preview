import { manifests as treeManifests } from "./tree/manifests.js";
import { manifests as menuManifests } from "./menu-item/manifests.js";
import { manifests as workspaceManifests } from "./workspace/manifests.js";
import { WORKFLOW_SETTINGS_WORKSPACE_KIND } from "./constants.js";

export const manifests = [
  ...treeManifests,
  ...menuManifests,
  ...workspaceManifests,
  {
    type: "kind",
    alias: "Workflow.Kind.WorkspaceSettings",
    name: "Workflow Settings Host Workspace",
    matchKind: WORKFLOW_SETTINGS_WORKSPACE_KIND,
    matchType: "workspace",
    manifest: {
      type: "workspace",
      kind: WORKFLOW_SETTINGS_WORKSPACE_KIND,
      elementName: "umb-routable-workspace",
    },
  },
];
