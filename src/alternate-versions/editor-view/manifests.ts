import { UMB_DOCUMENT_WORKSPACE_ALIAS } from "@umbraco-cms/backoffice/document";
import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_ENTITY_IS_NEW_VISIBILITY_CONDITION,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "@umbraco-workflow/core";
import { WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_READ } from "../user-permissions/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceView",
    weight: 149,
    name: "Document Workspace Alternate Versions View",
    alias: "Workflow.AlternateVersions.WorkspaceView.Document",
    element: () =>
      import("./alternate-versions-document-workspace-view.element.js"),
    meta: {
      label: "#workflow_alternateVersions_versions",
      pathname: "versions",
      icon: "icon-documents",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: UMB_DOCUMENT_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_ENTITY_IS_NEW_VISIBILITY_CONDITION,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_READ,
      },
    ],
  },
];
