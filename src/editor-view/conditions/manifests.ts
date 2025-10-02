import {
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION_ALIAS,
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION_ALIAS,
  WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_DOCUMENT_UNLOCK_CONDITION_ALIAS,
  WORKFLOW_DOCUMENT_WORKSPACE_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS,
  WORKFLOW_DOCUMENT_IS_NEW_VISIBILITY_CONDITION,
} from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "condition",
    name: "Document Workspace Variant Show Request Approval Condition",
    alias:
      WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION_ALIAS,
    api: () => import("./show-request-approval.condition.js"),
  },
  {
    type: "condition",
    name: "Document Workspace Variant Show Workflow Detail Condition",
    alias:
      WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION_ALIAS,
    api: () => import("./show-workflow-detail.condition.js"),
  },
  {
    type: "condition",
    name: "Document Workspace Variant Show Document Unlock Condition",
    alias:
      WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_DOCUMENT_UNLOCK_CONDITION_ALIAS,
    api: () => import("./show-document-unlock.condition.js"),
  },
  {
    type: "condition",
    name: "Document Workspace Variant Entity Action Visibility Condition",
    alias: WORKFLOW_DOCUMENT_WORKSPACE_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./entity-action-visibility.condition.js"),
  },
  {
    type: "condition",
    name: "Document Workspace Document Is New Condition",
    alias: WORKFLOW_DOCUMENT_IS_NEW_VISIBILITY_CONDITION,
    api: () => import("./document-is-new.condition.js"),
  },
];
