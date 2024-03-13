import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_DIFF_MODAL_ALIAS = "Umb.Modal.Workflow.Diff";

export interface WorkflowDiffModalData {
  instanceKey: string;
}

export const WORKFLOW_DIFF_MODAL = new UmbModalToken<WorkflowDiffModalData>(
  WORKFLOW_DIFF_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "medium",
    },
  }
);
