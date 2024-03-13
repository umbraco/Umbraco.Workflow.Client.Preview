import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowInstanceResponseModel } from "@umbraco-workflow/generated";

export const WORKFLOW_DETAIL_MODAL_ALIAS = "Umb.Modal.Workflow.Detail";

export interface WorkflowDetailModalData {
  item?: WorkflowInstanceResponseModel;
  unique?: string;
  contentTypeId?: string;
  isDashboard?: boolean;
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
