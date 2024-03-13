import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_SUBMIT_MODAL_ALIAS = "Umb.Modal.Workflow.SubmitWorkflow";

export const WORKFLOW_SUBMIT_MODAL = new UmbModalToken(
  WORKFLOW_SUBMIT_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "medium",
    },
  }
);
