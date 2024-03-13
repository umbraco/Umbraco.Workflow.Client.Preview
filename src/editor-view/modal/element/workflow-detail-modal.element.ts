import {
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { WorkflowDetailModalData } from "../token/index.js";
import {
  WORKFLOW_MANAGER_CONTEXT,
  WorkflowManagerContext,
} from "@umbraco-workflow/context";

const elementName = "workflow-detail-modal";

@customElement(elementName)
export class WorkflowDetailModalElement extends UmbModalBaseElement<WorkflowDetailModalData> {
  #workflowManagerContext = new WorkflowManagerContext(this);

  @state()
  headline = "";

  #close() {
    this.modalContext?.reject();
  }

  connectedCallback() {
    super.connectedCallback();

    const item = this.data?.item;

    this.#workflowManagerContext.init(
      item,
      item?.node?.key ?? this.data?.unique,
      item?.node?.contentTypeKey ?? this.data?.contentTypeId
    );

    this.provideContext(WORKFLOW_MANAGER_CONTEXT, this.#workflowManagerContext);

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
        <div id="editor-box">
          <workflow-workspace-action></workflow-workspace-action>
        </div>
        <div slot="actions">
          <uui-button id="close" label="Close" @click="${this.#close}"
            >Close</uui-button
          >
        </div>
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
