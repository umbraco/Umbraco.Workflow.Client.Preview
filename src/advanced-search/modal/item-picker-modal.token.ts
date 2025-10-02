import {
  UmbModalToken,
  type UmbPickerModalValue,
} from "@umbraco-cms/backoffice/modal";
import type { SelectableNameKeyPairModel } from "@umbraco-workflow/generated";

export const WORKFLOW_ITEM_PICKER_MODAL_ALIAS = "Workflow.Modal.ItemPicker";

export interface WorkflowItemPickerModalData {
  multiple: boolean;
  items: Array<SelectableNameKeyPairModel & { alias?: string }>;
}

export interface WorkflowItemPickerModalResult extends UmbPickerModalValue {}

export const WORKFLOW_ITEM_PICKER_MODAL = new UmbModalToken<
  WorkflowItemPickerModalData,
  WorkflowItemPickerModalResult
>(WORKFLOW_ITEM_PICKER_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "small",
  },
});
