import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowEmailSendToModalData,
  WorkflowEmailSendToModalResult,
} from "./workflow-email-sendto-modal.token.js";

const elementName = "workflow-email-sendto-modal";

@customElement(elementName)
export class WorkflowEmailSendToModalElement extends UmbModalBaseElement<
  WorkflowEmailSendToModalData,
  WorkflowEmailSendToModalResult
> {
  #items: Array<{ label: string; value: string; checked: boolean }> = [];
  #value?: Array<string>;

  connectedCallback() {
    super.connectedCallback();

    this.#items =
      this.data?.config.map((c) => ({
        value: <string>c.value,
        checked: this.data?.emailType.to.includes(<number>c.value) ?? false,
        label: this.localize.term(`workflow_${c.alias}`),
      })) ?? [];

    this.#value = this.data?.emailType.to.map((x) => x.toString()) ?? [];
  }

  #handleChange(e: UUIBooleanInputEvent) {
    const selected = e.target.value;
    const selectedIds = this.#items
      .filter((x) => selected.includes(x.value))
      .map((x) => Number(x.value));

    this.value = { selectedIds };
  }

  render() {
    return html`<uui-dialog-layout
      headline="Send to: ${this.data?.emailType.name}"
    >
      <umb-input-checkbox-list
        @change=${this.#handleChange}
        .selection=${this.#value}
        .list=${this.#items}
      ></umb-input-checkbox-list>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_cancel")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this._submitModal}
        ></uui-button>
      </div>
    </uui-dialog-layout>`;
  }
}

export default WorkflowEmailSendToModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowEmailSendToModalElement;
  }
}
