import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowEmailSendToModalData,
  WorkflowEmailSendToModalResult,
} from "../token/workflow-email-sendto-modal.token.js";

const elementName = "workflow-email-sendto-modal";

@customElement(elementName)
export class WorkflowEmailSendToModalElement extends UmbModalBaseElement<
  WorkflowEmailSendToModalData,
  WorkflowEmailSendToModalResult
> {
  #items: Array<{ key: string; checked: boolean; value: string }> = [];
  #valueString = "";

  connectedCallback() {
    super.connectedCallback();

    this.#items =
      this.data?.config.map((c) => ({
        key: c.value,
        checked: this.data?.emailType.to.includes(c.value) ?? false,
        value: this.localize.term(`workflow_${c.alias}`),
      })) ?? [];

    this.#valueString = this.#items
      .filter((x) => x.checked)
      .map((x) => x.value)
      .join(",");
  }

  #handleSubmit() {
    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
  }

  #handleChange(e: UUIBooleanInputEvent) {
    const selected = e.target.value;
    const selectedIds = this.#items
      .filter((x) => selected.includes(x.value))
      .map((x) => Number(x.key));
    this.value = { selectedIds };
  }

  render() {
    return html`<umb-body-layout
      headline="Send to: ${this.data?.emailType.name}"
    >
      <div id="main">
        <umb-input-checkbox-list
          @change=${this.#handleChange}
          .value=${this.#valueString}
          .list=${this.#items}
        ></umb-input-checkbox-list>
      </div>
      <div slot="actions">
        <uui-button
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
        <uui-button
          id="submit"
          color="positive"
          look="primary"
          label="Submit"
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }
}

export default WorkflowEmailSendToModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowEmailSendToModalElement;
  }
}
