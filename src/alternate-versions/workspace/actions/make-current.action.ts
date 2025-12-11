import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { WorkflowAlternateVersionDetailRepository } from "../../repository/detail/alternate-version-detail.repository.js";
import { AlternateVersionWorkspaceActionBase } from "./base.action.js";

export class WorkflowAlternateVersionMakeCurrentWorkspaceAction extends AlternateVersionWorkspaceActionBase {
  #detailRepository = new WorkflowAlternateVersionDetailRepository(this);

  override async execute() {
    const unique = this.workspaceContext?.getUnique();
    if (!unique) throw new Error("Unique is required");

    await umbConfirmModal(this._host, {
      headline: this.localize.term("buttons_confirmActionConfirm"),
      content: this.localize.term(
        "workflow_alternateVersions_makeCurrentDescription"
      ),
    });

    await this.#detailRepository.setActive(unique);
    await this.documentWorkspaceContext?.reload();
  }
}

export { WorkflowAlternateVersionMakeCurrentWorkspaceAction as api };
