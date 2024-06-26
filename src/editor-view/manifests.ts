import type { ManifestWorkspaceView } from "@umbraco-cms/backoffice/extension-registry";

import { manifests as conditionManifests } from "./conditions/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as workspaceActionManifests } from "./actions/manifests.js";

const workspaceEditorViewManifest: ManifestWorkspaceView = {
  type: "workspaceView",
  conditions: [
    {
      alias: "Umb.Condition.WorkspaceAlias",
      match: "Umb.Workspace.Document",
    },
  ],
  meta: {
    label: "Workflow",
    pathname: "workflow",
    icon: "icon-nodes",
  },
  name: "Document Workspace Workflow View",
  alias: "Workflow.WorkspaceView.Document",
  element: () => import("./document-workspace-view-workflow.element.js"),
};

export const manifests = [
  workspaceEditorViewManifest,
  ...workspaceActionManifests,
  ...conditionManifests,
  ...modalManifests,
];
