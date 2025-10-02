import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_DETAIL_READONLY_MODAL_ALIAS =
  "Workflow.Modal.DetailReadonly";

export interface WorkflowDetailReadonlyModalData {
  unique?: string;
  isDashboard: boolean;
  entityType?: string | null;
  entityKey?: string | null;
}

export const WORKFLOW_DETAIL_READONLY_MODAL =
  new UmbModalToken<WorkflowDetailReadonlyModalData>(
    WORKFLOW_DETAIL_READONLY_MODAL_ALIAS,
    {
      modal: {
        type: "sidebar",
        size: "medium",
      },
    }
  );
