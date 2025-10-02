import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_TEXT_MODAL_ALIAS = "Workflow.Modal.Text";

export interface WorkflowTextModalData {
  content: string;
}

export const WORKFLOW_TEXT_MODAL = new UmbModalToken<
  WorkflowTextModalData,
  never
>(WORKFLOW_TEXT_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "small",
  },
});