import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_RELEASESET_SUBMIT_MODAL_ALIAS =
  "Workflow.ReleaseSet.Modal.SubmitWorkflow";

export const WORKFLOW_RELEASESET_SUBMIT_MODAL = new UmbModalToken(
  WORKFLOW_RELEASESET_SUBMIT_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "medium",
    },
  }
);
