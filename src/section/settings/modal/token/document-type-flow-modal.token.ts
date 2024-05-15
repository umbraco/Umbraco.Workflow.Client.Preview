import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type {
  WorkflowConfigUpdateRequestModel,
  ContentTypePropertyModel,
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

export const WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS =
  "Workflow.Modal.DocumentTypeFlow";

export interface WorkflowDocumentTypeFlowModalData {
  contentTypes: Array<ContentTypePropertyModel>;
  permissions: Array<UserGroupPermissionsModel>;
  existing: Array<string | null | undefined>;
  configureThreshold: boolean;
  defaultThreshold: number;
  isNew: boolean;
  key?: string | null;
}

export type WorkflowDocumentTypeFlowModalResult = WorkflowConfigUpdateRequestModel;

export const WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL = new UmbModalToken<
  WorkflowDocumentTypeFlowModalData,
  WorkflowDocumentTypeFlowModalResult
>(WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
