import type { ManifestWorkspaceAction } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION,
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION,
} from "../conditions/manifests.js";
import { WorkflowDetailWorkspaceAction } from "./workflow-detail.action.js";
import { WorkflowSubmitWorkflowWorkspaceAction } from "./submit-workflow.action.js";

export const WORKFLOW_SUBMIT_ACTION_ALIAS =
  "Umb.Workflow.WorkspaceAction.Document.Submit";

export const WORKFLOW_DETAIL_ACTION_ALIAS =
  "Umb.Workflow.WorkspaceAction.Document.Detail";

const workspaceActionManifests: Array<ManifestWorkspaceAction> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: WORKFLOW_SUBMIT_ACTION_ALIAS,
    name: "Submit Workfow Workspace Action",
    weight: 10,
    api: WorkflowSubmitWorkflowWorkspaceAction,
    meta: {
      label: "Request approval",
      look: "primary",
      color: "positive",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document",
      },
      {
        alias:
          WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION,
      },
    ],
    overwrites: ["Umb.WorkspaceAction.Document.SaveAndPublish"],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: WORKFLOW_DETAIL_ACTION_ALIAS,
    name: "Workfow Detail Workspace Action",
    weight: 10,
    api: WorkflowDetailWorkspaceAction,
    meta: {
      label: "Workflow detail",
      look: "primary",
      color: "default",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document",
      },
      {
        alias:
          WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION,
      },
    ],
    overwrites: [
      "Umb.WorkspaceAction.Document.SaveAndPublish",
      "Umb.WorkspaceAction.Document.Save",
    ],
  },
];

export const manifests = [...workspaceActionManifests];
