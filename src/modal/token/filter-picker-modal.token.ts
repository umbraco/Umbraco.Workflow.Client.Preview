import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { WorkflowFilterConfig } from "@umbraco-workflow/components";

export const WORKFLOW_FILTER_PICKER_MODAL_ALIAS =
  "Workflow.Modal.FilterPicker";

export interface WorkflowFilterPickerModalData {
  config?: WorkflowFilterConfig;
}

export interface WorkflowFilterPickerModalResult {
  config?: WorkflowFilterConfig;
}

export const WORKFLOW_FILTER_PICKER_MODAL = new UmbModalToken<
  WorkflowFilterPickerModalData,
  WorkflowFilterPickerModalResult
>(WORKFLOW_FILTER_PICKER_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
