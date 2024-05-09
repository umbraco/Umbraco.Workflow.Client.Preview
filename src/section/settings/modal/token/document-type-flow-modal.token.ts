import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type {
  WorkflowConfigUpdateRequestModel,
  ContentTypePropertyModel,
  LanguageModel,
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

export const WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS =
  "Workflow.Modal.DocumentTypeFlow";

export interface WorkflowDocumentTypeFlowModalData {
  contentTypes: Array<ContentTypePropertyModel>;
  languages: Array<LanguageModel>;
  permissions: Array<UserGroupPermissionsModel>;
  isNew: boolean;
}

export type WorkflowDocumentTypeFlowModalResult = {
  result: WorkflowConfigUpdateRequestModel;
};

export const WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL = new UmbModalToken<
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult
>(WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
