import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL } from "../../modal/index.js";
import { AlternateVersionWorkspaceActionBase } from "./base.action.js";

export class WorkflowAlternateVersionSubmitWorkflowWorkspaceAction extends AlternateVersionWorkspaceActionBase {
  async execute() {
    await umbOpenModal(this, WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL);
  }
}

export { WorkflowAlternateVersionSubmitWorkflowWorkspaceAction as api };
