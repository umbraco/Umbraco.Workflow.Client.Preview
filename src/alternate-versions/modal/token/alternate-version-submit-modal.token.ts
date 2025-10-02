import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL_ALIAS = "Workflow.AlternateVersion.Modal.SubmitWorkflow";

export const WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL = new UmbModalToken(
    WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "medium",
    },
  }
);
