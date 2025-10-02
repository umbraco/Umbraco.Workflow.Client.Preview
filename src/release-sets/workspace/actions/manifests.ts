import {
  UMB_WORKSPACE_CONDITION_ALIAS,
  UmbSubmitWorkspaceAction,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_RELEASESET_WORKSPACE_ALIAS } from "../../constants.js";
import { WorkflowReleaseSetPublishAction } from "./release-set-publish.action.js";
import {
  WORKFLOW_USER_PERMISSION_RELEASESET_PUBLISH,
  WORKFLOW_USER_PERMISSION_RELEASESET_UPDATE,
} from "../../user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";

const WORKFLOW_RELEASESET_WORKSPACE_ACTION_PUBLISH =
  "Workflow.WorkspaceAction.ReleaseSet.Publish";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ReleaseSet.Save",
    name: "Save Workflow Release Set Workspace Action",
    weight: 100,
    api: UmbSubmitWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_UPDATE,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: WORKFLOW_RELEASESET_WORKSPACE_ACTION_PUBLISH,
    name: "Publish Workflow Release Set Workspace Action",
    weight: 90,
    api: WorkflowReleaseSetPublishAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_saveAndPublish",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_PUBLISH,
      },
    ],
  },
  {
    type: "workspaceActionMenuItem",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ReleaseSet.Unpublish",
    name: "Unpublish Workflow Release Set Workspace Action",
    weight: 0,
    api: () => import("./release-set-unpublish.action.js"),
    forWorkspaceActions: WORKFLOW_RELEASESET_WORKSPACE_ACTION_PUBLISH,
    meta: {
      label: "#actions_unpublish",
      icon: "icon-globe",
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_PUBLISH,
      },
    ],
  },
  {
    type: "workspaceActionMenuItem",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ReleaseSet.Schedule",
    name: "Schedule Workflow Release Set Workspace Action",
    weight: 20,
    api: () => import("./release-set-schedule.action.js"),
    forWorkspaceActions: WORKFLOW_RELEASESET_WORKSPACE_ACTION_PUBLISH,
    meta: {
      label: "#buttons_schedulePublish",
      icon: "icon-globe",
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_PUBLISH,
      },
    ],
  },
];
