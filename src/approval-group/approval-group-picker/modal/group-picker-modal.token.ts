import {
  UmbModalToken,
  type UmbPickerModalValue,
  type UmbPickerModalData,
} from "@umbraco-cms/backoffice/modal";
import type { WorkflowApprovalGroupCollectionModel } from "@umbraco-workflow/approval-group";
import type { ApprovalGroupItemResponseModel } from "@umbraco-workflow/generated";

export const WORKFLOW_GROUP_PICKER_MODAL_ALIAS = "Workflow.Modal.GroupPicker";

export interface WorkflowGroupPickerModalData
  extends UmbPickerModalData<ApprovalGroupItemResponseModel> {}

export interface WorkflowGroupPickerModalResult extends UmbPickerModalValue {
  selectedItems: Array<WorkflowApprovalGroupCollectionModel>;
}

export const WORKFLOW_GROUP_PICKER_MODAL = new UmbModalToken<
  WorkflowGroupPickerModalData,
  UmbPickerModalValue
>(WORKFLOW_GROUP_PICKER_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "small",
  },
});
