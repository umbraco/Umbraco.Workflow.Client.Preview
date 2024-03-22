import type { UmbPickerModalData } from "@umbraco-cms/backoffice/modal";
import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_ITEM_PICKER_MODAL_ALIAS = "Workflow.Modal.ItemPicker";

export interface WorkflowItemPickerModalData {
  multiple: boolean;
  items: Array<any>;
}

export interface WorkflowItemPickerModalResult extends UmbPickerModalData<any> {
  items: Array<any>;
}

export const WORKFLOW_ITEM_PICKER_MODAL = new UmbModalToken<
  WorkflowItemPickerModalData,
  WorkflowItemPickerModalResult
>(WORKFLOW_ITEM_PICKER_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "small",
  },
});
