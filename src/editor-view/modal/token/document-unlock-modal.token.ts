import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_DOCUMENT_UNLOCK_MODAL_ALIAS =
  "Workflow.Modal.DocumentUnlock";

export interface WorkflowDocumentUnlockModalData {
}

export interface WorkflowDocumentUnlockModalResult {
  publish: boolean;
}

export const WORKFLOW_DOCUMENT_UNLOCK_MODAL = new UmbModalToken<
  WorkflowDocumentUnlockModalData,
  WorkflowDocumentUnlockModalResult
>(WORKFLOW_DOCUMENT_UNLOCK_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "small",
  },
});
