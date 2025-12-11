import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  UMB_DOCUMENT_WORKSPACE_ALIAS,
  UMB_USER_PERMISSION_DOCUMENT_UPDATE,
} from "@umbraco-cms/backoffice/document";
import { WORKFLOW_USER_PERMISSION_DOCUMENT_INITIATE } from "../user-permissions/constants.js";
import {
  WORKFLOW_DETAIL_VISIBILITY_CONDITION_ALIAS,
  WORKFLOW_REQUEST_APPROVAL_VISIBILITY_CONDITION_ALIAS,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "@umbraco-workflow/core";
import { WORKFLOW_DOCUMENT_UNLOCK_VISIBILITY_CONDITION_ALIAS } from "../conditions/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.Document.Submit",
    name: "Submit Workflow Workspace Action",
    weight: 75,
    api: () => import("./submit.action.js"),
    meta: {
      label: "#workflow_approvalButton",
      look: "primary",
      color: "positive",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: UMB_DOCUMENT_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        allOf: [
          UMB_USER_PERMISSION_DOCUMENT_UPDATE,
          WORKFLOW_USER_PERMISSION_DOCUMENT_INITIATE,
        ],
      },
      {
        alias: WORKFLOW_REQUEST_APPROVAL_VISIBILITY_CONDITION_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.Document.Detail",
    name: "Workflow Detail Workspace Action",
    weight: 10,
    api: () => import("../../core/actions/detail.action.js"),
    meta: {
      label: "#workflow_detailButton",
      look: "primary",
      color: "default",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: UMB_DOCUMENT_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_DETAIL_VISIBILITY_CONDITION_ALIAS,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.Document.Unlock",
    name: "Workflow Document Unlock Workspace Action",
    weight: 10,
    api: () => import("./unlock.action.js"),
    meta: {
      label: "#workflow_unlockButton",
      look: "primary",
      color: "positive",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: UMB_DOCUMENT_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_DOCUMENT_UNLOCK_VISIBILITY_CONDITION_ALIAS,
      },
    ],
  },
];
