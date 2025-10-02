import { UMB_DOCUMENT_WORKSPACE_ALIAS } from "@umbraco-cms/backoffice/document";
import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_DOCUMENT_IS_NEW_VISIBILITY_CONDITION } from "src/editor-view/conditions/constants.js";

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
      label: "#workflow_alternateVersions_versions",
      pathname: "versions",
      icon: "icon-documents",
    },
    weight: 149,
    name: "Document Workspace Alternate Versions View",
    alias: "Workflow.AlternateVersions.WorkspaceView.Document",
    element: () =>
      import("./alternate-versions-document-workspace-view.element.js"),
  },
];
