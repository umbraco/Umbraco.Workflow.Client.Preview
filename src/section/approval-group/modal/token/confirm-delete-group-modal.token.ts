import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowApprovalGroupsRepository } from '../../repository/approval-groups.repository.js';

export const WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS =
  "Umb.Modal.Workflow.ConfirmDeleteGroup";

export interface WorkflowConfirmDeleteGroupModalData {
  groupName: string;
  unique: string;
  repository: WorkflowApprovalGroupsRepository,
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
