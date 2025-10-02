import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SUBMIT_MODAL } from "@umbraco-workflow/editor-view";

export class WorkflowSubmitWorkflowWorkspaceAction extends UmbWorkspaceActionBase {
  async execute() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext?.open(this, WORKFLOW_SUBMIT_MODAL);
    await modalHandler?.onSubmit().catch(() => undefined);
  }
}

export { WorkflowSubmitWorkflowWorkspaceAction as api };
