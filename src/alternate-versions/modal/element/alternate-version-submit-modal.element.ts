import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../workspace/index.js";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import { InitiateWorkflowArgs } from "@umbraco-workflow/repository";
import { WorkflowSubmitModalBaseElement } from "@umbraco-workflow/core";

const elementName = "workflow-alternate-version-submit-modal";

@customElement(elementName)
export class WorkflowAlternateVersionSubmitModalElement extends WorkflowSubmitModalBaseElement {
  #documentWorkspace?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => (this.#documentWorkspace = context)
    );
  }

  getInitiatorArgs(): Partial<InitiateWorkflowArgs> {
    if (!this.#documentWorkspace) {
      throw new Error("Alternate Version workspace is not available");
    }

    return {
      entityType: ALTERNATEVERSION_ENTITY_TYPE,
      nodeUnique: this.#documentWorkspace.getUnique()!,
      publish: true,
      cultures: [
        this.#documentWorkspace.getCurrentVariant()?.toCultureString() ?? "",
      ],
    };
  }
}

export default WorkflowAlternateVersionSubmitModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionSubmitModalElement;
  }
}
