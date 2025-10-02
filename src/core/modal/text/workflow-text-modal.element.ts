import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { WorkflowTextModalData } from "./workflow-text-modal.token";

const elementName = "workflow-text-modal";

@customElement(elementName)
export class WorkflowTextModalElement extends UmbModalBaseElement<
  WorkflowTextModalData,
  never
> {
  render() {
    if (!this.data) return;

    return html`
      <uui-dialog-layout
        >${this.data.content}
        <uui-button
          slot="actions"
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
      </uui-dialog-layout>
    `;
  }
}

export default WorkflowTextModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTextModalElement;
  }
}
