import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../workspace/index.js";
import { RELEASESET_ENTITY_TYPE } from "src/release-sets/constants.js";
import { InitiateWorkflowArgs } from "@umbraco-workflow/repository";
import { WorkflowSubmitModalBaseElement } from "@umbraco-workflow/core";

const elementName = "workflow-release-set-submit-modal";

@customElement(elementName)
export class WorkflowReleaseSetSubmitModalElement extends WorkflowSubmitModalBaseElement {
  #documentWorkspace?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  getInitiatorArgs(): Partial<InitiateWorkflowArgs> {
    if (!this.#documentWorkspace) {
      throw new Error("Release Set workspace is not available");
    }

    return {
      entityType: RELEASESET_ENTITY_TYPE,
      nodeUnique: this.#documentWorkspace.getUnique()!,
      publish: true,
      cultures: [],
    };
  }
}

export default WorkflowReleaseSetSubmitModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetSubmitModalElement;
  }
}
