import {
  UmbModalToken,
  type UmbPickerModalValue,
  type UmbPickerModalData,
} from "@umbraco-cms/backoffice/modal";
import type {
  ApprovalGroupItemModel,
  WorkflowApprovalGroupCollectionModel,
} from "@umbraco-workflow/approval-group";

export const WORKFLOW_APPROVALGROUP_PICKER_MODAL_ALIAS =
  "Workflow.Modal.GroupPicker";

export interface WorkflowGroupPickerModalData
  extends UmbPickerModalData<ApprovalGroupItemModel> {}

export interface WorkflowGroupPickerModalResult extends UmbPickerModalValue {
  selectedItems: Array<WorkflowApprovalGroupCollectionModel>;
}

export const WORKFLOW_APPROVALGROUP_PICKER_MODAL = new UmbModalToken<
  WorkflowGroupPickerModalData,
  UmbPickerModalValue
>(WORKFLOW_APPROVALGROUP_PICKER_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "small",
  },
});
