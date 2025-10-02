import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { ALTERNATEVERSION_ENTITY_TYPE, WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS } from "../constants.js";
import { manifests as workspaceActionManifests } from "./actions/manifests.js";
import { manifests as conditionManifests } from "./conditions/manifests.js";

export const manifests = [
  ...workspaceActionManifests,
  ...conditionManifests,
  {
    type: "workspace",
    kind: "routable",
    alias: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
    name: "Workflow Alternate Version Workspace",
    api: () => import('./context/alternate-version-workspace.context.js'),
    meta: {
      entityType: ALTERNATEVERSION_ENTITY_TYPE,
    },
  },
  {
    type: "workspaceView",
    kind: "contentEditor",
    alias: "Workflow.WorkspaceView.AlternateVersion.Edit",
    name: "Workflow Alternate Version Workspace Edit View",
    element: () => import("./views/edit/alternate-version-editor.element.js"),
    weight: 1000,
    meta: {
      label: "#general_content",
      pathname: "content",
      icon: "document",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
    ],
  },
  {
    type: "workspaceView",
    alias: "Workflow.WorkspaceView.AlternateVersion.Info",
    name: "Workflow Alternate Version Workspace Info View",
    element: () =>
      import("./views/info/alternate-version-workspace-view-info.element.js"),
    weight: 100,
    meta: {
      label: "#general_info",
      pathname: "info",
      icon: "info",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
    ],
  },
];
