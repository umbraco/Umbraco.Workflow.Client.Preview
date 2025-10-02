import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_DETAIL_MODAL_ALIAS = "Workflow.Modal.Detail";

export interface WorkflowDetailModalData {
  instanceUnique?: string;
  document?: { name?: string, unique?: string } | null;
  variant?: string;
  action?: string | null;
  entityType?: string | null;
  entityKey?: string | null;
  isDashboard: boolean;
}

// TODO -> should this be in core? It is referenced from detail.action, which is in core
export const WORKFLOW_DETAIL_MODAL = new UmbModalToken<WorkflowDetailModalData>(
  WORKFLOW_DETAIL_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "full",
    },
  }
);
