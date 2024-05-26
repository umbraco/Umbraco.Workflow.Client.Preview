import {
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { WorkflowDetailModalData } from "../token/index.js";
import {
  WorkflowManagerContext,
  type WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";

const elementName = "workflow-detail-modal";

@customElement(elementName)
export class WorkflowDetailModalElement extends UmbModalBaseElement<WorkflowDetailModalData> {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  headline = "";

  connectedCallback() {
    super.connectedCallback();

    this.#workflowManagerContext = new WorkflowManagerContext(this);

    this.#workflowManagerContext.init(
      this.data?.documentUnique,
      this.data?.instanceUnique
    );

    this.observe(this.#workflowManagerContext.currentTask, (currentTask) => {
      if (!currentTask) return;

      this.headline = this.localize.term(
        "workflow_pendingForNode",
        currentTask.type?.toLowerCase(),
        currentTask.node?.name
      );
    });
  }

  render() {
    return html`
      <umb-body-layout .headline=${this.headline}>
        <workflow-workspace-action></workflow-workspace-action>
        <uui-button
          slot="actions"
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
      </umb-body-layout>
    `;
  }
}

export default WorkflowDetailModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDetailModalElement;
  }
}
