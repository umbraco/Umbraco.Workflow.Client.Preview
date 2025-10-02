import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL } from "../../modal/index.js";
import { AlternateVersionWorkspaceActionBase } from "./base.action.js";

export class WorkflowAlternateVersionSubmitWorkflowWorkspaceAction extends AlternateVersionWorkspaceActionBase {
  async execute() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) {
      throw new Error("Could not find context: UMB_MODAL_MANAGER_CONTEXT");
    }
    
    const modalHandler = modalContext.open(
      this,
      WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL
    );
    await modalHandler!.onSubmit().catch(() => undefined);
  }
}

export { WorkflowAlternateVersionSubmitWorkflowWorkspaceAction as api };
