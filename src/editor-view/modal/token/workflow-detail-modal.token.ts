import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_DETAIL_MODAL_ALIAS = "Workflow.Modal.Detail";

export interface WorkflowDetailModalData {
  instanceUnique?: string;
  documentUnique?: string;
}

export const WORKFLOW_DETAIL_MODAL = new UmbModalToken<WorkflowDetailModalData>(
  WORKFLOW_DETAIL_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "full",
    },
  }
);
