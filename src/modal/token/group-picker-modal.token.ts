import type { UmbPickerModalData } from "@umbraco-cms/backoffice/modal";
import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

export const WORKFLOW_GROUP_PICKER_MODAL_ALIAS =
  "Umb.Modal.Workflow.GroupPicker";

export interface WorkflowGroupPickerModalData {
  selection: Array<string | null>;
}

export interface WorkflowGroupPickerModalResult
  extends UmbPickerModalData<UserGroupBaseModel> {
  groups: Array<UserGroupBaseModel> | null;
}

export const WORKFLOW_GROUP_PICKER_MODAL = new UmbModalToken<
  WorkflowGroupPickerModalData,
  WorkflowGroupPickerModalResult
>(WORKFLOW_GROUP_PICKER_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "small",
  },
});
