import type {
  ManifestCondition,
  UmbConditionConfigBase,
} from "@umbraco-cms/backoffice/extension-api";
import { WorkflowDocumentWorkspaceVariantShowRequestApprovalCondition } from "./show-request-approval.condition.js";
import { WorkflowDocumentWorkspaceVariantShowWorkflowDetailCondition } from "./show-workflow-detail.condition.js";

export const WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION =
  "Umb.Condition.Document.Workspace.ShowRequestApproval";

export const WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION =
  "Umb.Condition.Document.Workspace.ShowWorkflowDetail";

export type WorkflowDocumentWorkspaceVariantShowWorkflowDetailConditionConfig =
  UmbConditionConfigBase<
    typeof WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION
  >;

export type WorkflowDocumentWorkspaceVariantShowRequestApprovalConditionConfig =
  UmbConditionConfigBase<
    typeof WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION
  >;

const conditionManifests: Array<ManifestCondition> = [
  {
    type: "condition",
    name: "Document Workspace Variant Show Request Approval Condition",
    alias: WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_REQUEST_APPROVAL_CONDITION,
    api: WorkflowDocumentWorkspaceVariantShowRequestApprovalCondition,
  },
  {
    type: "condition",
    name: "Document Workspace Variant Show Workflow Detail Condition",
    alias: WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_WORKFLOW_DETAIL_CONDITION,
    api: WorkflowDocumentWorkspaceVariantShowWorkflowDetailCondition,
  },
];

export const manifests = [...conditionManifests];
