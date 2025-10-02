import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  ALTERNATEVERSION_MAKECURRENT_VISIBILITY_CONDITION_ALIAS,
  ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION_ALIAS,
  ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION_ALIAS,
} from "../conditions/constants.js";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS } from "../../constants.js";
import { WorkflowAlternateVersionSaveWorkspaceAction } from "./save.action.js";
import { WorkflowAlternateVersionSubmitWorkflowWorkspaceAction } from "./submit.action.js";
import { WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE, WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_UPDATE } from "../../user-permissions/constants.js";
import { UMB_USER_PERMISSION_DOCUMENT_UPDATE } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.AlternateVersion.Save",
    name: "Save Workflow Alternate Version Workspace Action",
    weight: 100,
    api: WorkflowAlternateVersionSaveWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        allOf: [
          WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_UPDATE,
          UMB_USER_PERMISSION_DOCUMENT_UPDATE,
        ],
      },
    ],
  },

  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.AlternateVersion.Submit",
    name: "Alternate Version Submit Workflow Workspace Action",
    weight: 75,
    api: WorkflowAlternateVersionSubmitWorkflowWorkspaceAction,
    meta: {
      label: "#workflow_approvalButton",
      look: "primary",
      color: "positive",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
      {
        alias:
          ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.AlternateVersion.Detail",
    name: "Alternate Version Detail Workspace Action",
    weight: 10,
    api: () => import("../../../core/actions/detail.action.js"),
    meta: {
      label: "#workflow_detailButton",
      look: "primary",
      color: "default",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
      {
        alias:
          ALTERNATEVERSION_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.AlternateVersion.MakeCurrent",
    name: "Alternate Version Make Current Workspace Action",
    weight: 10,
    api: () => import("./make-current.action.js"),
    meta: {
      label: "#workflow_alternateVersions_makeCurrent",
      look: "primary",
      color: "default",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
      {
        alias: ALTERNATEVERSION_MAKECURRENT_VISIBILITY_CONDITION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        allOf: [
          WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE,
          UMB_USER_PERMISSION_DOCUMENT_UPDATE,
        ],
      },
    ],
  },
];
