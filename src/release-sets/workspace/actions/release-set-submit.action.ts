import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_SUBMIT_MODAL } from "../../modal/index.js";
import { WorkflowReleaseSetValidateAction } from "./release-set-validate.action.js";

export class WorkflowReleaseSetSubmitWorkspaceAction extends WorkflowReleaseSetValidateAction {
  async execute() {
    await this.validate(async () => await this.#submit());
  }

  async #submit() {
    await umbOpenModal(this, WORKFLOW_RELEASESET_SUBMIT_MODAL).catch(() => {});
  }
}

export { WorkflowReleaseSetSubmitWorkspaceAction as api };
