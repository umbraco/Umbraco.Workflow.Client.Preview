import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { AlternateVersionCollectionResponseModel } from "@umbraco-workflow/generated";

export const WORKFLOW_DOCUMENTVERSION_PICKER_MODAL_ALIAS =
  "Workflow.Modal.DocumentVersionPicker";

export interface WorkflowDocumentVersionPickerModalData {
  unique: string;
  culture?: string | null;
  segment?: string | null;
}

export interface WorkflowDocumentVersionPickerModalResult {
  selectedItem: Partial<AlternateVersionCollectionResponseModel>;
  selectedItems: Array<Partial<AlternateVersionCollectionResponseModel>>;
}

export const WORKFLOW_DOCUMENTVERSION_PICKER_MODAL = new UmbModalToken<
  WorkflowDocumentVersionPickerModalData,
  WorkflowDocumentVersionPickerModalResult
>(WORKFLOW_DOCUMENTVERSION_PICKER_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "small",
  },
});
