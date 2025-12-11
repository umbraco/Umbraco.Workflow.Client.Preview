import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  RELEASESET_ENTITY_TYPE,
  WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
} from "../constants.js";
import { manifests as actionManifests } from "./actions/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...actionManifests,
  {
    type: "workspace",
    kind: "routable",
    alias: WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
    name: "Workflow Release Set Workspace",
    api: () => import("./release-set-workspace.context.js"),
    meta: {
      entityType: RELEASESET_ENTITY_TYPE,
    },
  },
  {
    type: "workspaceView",
    kind: "contentEditor",
    alias: "Workflow.WorkspaceView.ReleaseSet.Edit",
    name: "Workflow Release Set Workspace Edit View",
    element: () => import("./views/edit/release-set-editor.element.js"),
    weight: 1000,
    meta: {
      label: "#general_content",
      pathname: "content",
      icon: "document",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceView",
    kind: "contentEditor",
    alias: "Workflow.WorkspaceView.ReleaseSet.Info",
    name: "Workflow Release Set Workspace Info View",
    element: () =>
      import("./views/info/release-set-workspace-view-info.element.js"),
    weight: 100,
    meta: {
      label: "#general_info",
      pathname: "info",
      icon: "info",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
      },
    ],
  },
];
