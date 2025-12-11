import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL } from "../modal/index.js";

export class WorkflowSubmitDocumentWorkflowWorkspaceAction extends UmbWorkspaceActionBase {
  async execute() {
    await umbOpenModal(this, WORKFLOW_SUBMIT_DOCUMENT_WORKFLOW_MODAL).catch(
      () => {}
    );
  }
}

export { WorkflowSubmitDocumentWorkflowWorkspaceAction as api };
