import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { AlternateVersionWorkspaceActionBase } from "./base.action.js";

export class WorkflowAlternateVersionReadyToPublishWorkspaceAction extends AlternateVersionWorkspaceActionBase {
  override async execute() {
    await umbConfirmModal(this._host, {
      headline: this.localize.term("buttons_confirmActionConfirm"),
      content: this.localize.term(
        "workflow_alternateVersions_readyToPublishDescription"
      ),
    });

    await this.workspaceContext?.setStatus("ReadyToPublish");
    await this.documentWorkspaceContext?.reload();
  }
}

export { WorkflowAlternateVersionReadyToPublishWorkspaceAction as api };
