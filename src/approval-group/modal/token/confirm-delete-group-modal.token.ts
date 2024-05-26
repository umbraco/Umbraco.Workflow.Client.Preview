import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowApprovalGroupsDetailRepository } from "../../repository/detail/approval-groups-detail.repository.js";

export const WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS =
  "Workflow.Modal.ConfirmDeleteGroup";

export interface WorkflowConfirmDeleteGroupModalData {
  groupName: string;
  unique: string;
  repository: WorkflowApprovalGroupsDetailRepository;
}

export type WorkflowConfirmDeleteGroupModalResult = object;

export const WORKFLOW_CONFIRM_DELETE_GROUP_MODAL = new UmbModalToken<
  WorkflowConfirmDeleteGroupModalData,
  WorkflowConfirmDeleteGroupModalResult
>(WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "medium",
  },
});
