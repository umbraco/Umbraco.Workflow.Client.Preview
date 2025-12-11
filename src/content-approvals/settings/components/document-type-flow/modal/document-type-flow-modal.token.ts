import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { ApprovalThresholdModel, DocumentTypeConfigResponseModel, DocumentTypePermissionConfigModel } from "@umbraco-workflow/generated";

export const WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS =
  "Workflow.Modal.DocumentTypeFlow";

export interface WorkflowDocumentTypeFlowModalData {
  permissions: Array<DocumentTypePermissionConfigModel>;
  existing: Array<string | null | undefined>;
  configureThreshold: boolean;
  defaultThreshold: ApprovalThresholdModel;
  unique?: string | null;
}

export type WorkflowDocumentTypeFlowModalResult = DocumentTypeConfigResponseModel;

export const WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL = new UmbModalToken<
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult
>(WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
