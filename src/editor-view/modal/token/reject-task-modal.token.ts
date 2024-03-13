import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { UserGroupPermissionsModel } from "@umbraco-workflow/generated";

export const WORKFLOW_REJECT_TASK_MODAL_ALIAS = "Umb.Modal.Workflow.RejectTask";

export interface WorkflowRejectTaskModalData {
  groups: Array<UserGroupPermissionsModel>;
  requestedBy?: string | null;
}

export interface WorkflowRejectTaskModalResult {
  assignTo?: string;
}

export const WORKFLOW_REJECT_TASK_MODAL = new UmbModalToken<
  WorkflowRejectTaskModalData,
  WorkflowRejectTaskModalResult
>(WORKFLOW_REJECT_TASK_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "medium",
  },
});
