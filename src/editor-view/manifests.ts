import { UMB_DOCUMENT_WORKSPACE_ALIAS } from "@umbraco-cms/backoffice/document";
import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { manifests as conditionManifests } from "./conditions/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as workspaceActionManifests } from "./actions/manifests.js";
import { WORKFLOW_DOCUMENT_IS_NEW_VISIBILITY_CONDITION } from "./conditions/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceView",
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: UMB_DOCUMENT_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_DOCUMENT_IS_NEW_VISIBILITY_CONDITION,
      },
    ],
    meta: {
      label: "#workflow_workflow",
      pathname: "workflow",
      icon: "icon-nodes",
    },
    weight: 150,
    name: "Document Workspace Workflow View",
    alias: "Workflow.WorkspaceView.Document",
    element: () => import("./document-workspace-view-workflow.element.js"),
  },
  ...workspaceActionManifests,
  ...conditionManifests,
  ...modalManifests,
];
