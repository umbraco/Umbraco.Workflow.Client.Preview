import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowInstanceResponseModel } from "@umbraco-workflow/generated";

export const WORKFLOW_DETAIL_READONLY_MODAL_ALIAS = "Workflow.Modal.DetailReadonly";

export interface WorkflowDetailReadonlyModalData {
  item?: WorkflowInstanceResponseModel;
}

export const WORKFLOW_DETAIL_READONLY_MODAL = new UmbModalToken<WorkflowDetailReadonlyModalData>(
  WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "full",
    },
  }
);
