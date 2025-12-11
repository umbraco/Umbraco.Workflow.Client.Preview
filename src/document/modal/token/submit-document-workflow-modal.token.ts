import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL_ALIAS =
  "Workflow.Modal.SubmitDocumentWorkflow";

export const WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL = new UmbModalToken(
  WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "medium",
    },
  }
);
