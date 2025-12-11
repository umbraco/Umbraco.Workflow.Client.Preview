import { asDatetimeLocal } from "@umbraco-workflow/core";
import { WorkflowReleaseSetValidateAction } from "./release-set-validate.action.js";

export class WorkflowReleaseSetPublishAction extends WorkflowReleaseSetValidateAction {
  override async execute() {
    if (!this.workspaceContext) return;
    this.validate(() => this.#submit(false));
  }

  #submit(completeAllItems?: boolean) {
    if (!this.workspaceContext) return;

    this.workspaceContext.update({ releaseDate: asDatetimeLocal() });
    this.workspaceContext.updateSetStatus("Published", completeAllItems);
    this.workspaceContext.submit();
  }
}

export { WorkflowReleaseSetPublishAction as api };
