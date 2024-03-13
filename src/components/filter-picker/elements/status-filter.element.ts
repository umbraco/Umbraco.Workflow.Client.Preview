import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-status-filter";

@customElement(elementName)
export class WorkflowStatusFilterElement extends WorkflowBaseFilterElement<
  Array<string>
> {
  #removeArrayValue(idx: number) {
    this.value.splice(idx, 1);
    this.setValue(this.value);
    this.requestUpdate("value");
  }

  #updateArrayValue(e: InputEvent, idx: number) {
    this.value[idx] = (e.target as HTMLInputElement).value;
    this.setValue(this.value);
  }

  #addStatus() {
    this.value = [...this.value, ""];
    this.requestUpdate("value");
  }

  render() {
    return html` ${this.value?.map((value, idx) => {
        const statusValues = structuredClone(this.options ?? []);
        statusValues.forEach((v) => (v.selected = v.value === value));

        return html`<div id="statusWrapper">
          <uui-select
            .options=${statusValues}
            @change=${(e: InputEvent) => this.#updateArrayValue(e, idx)}
            label="Select status"
          ></uui-select
          ><uui-button
            @click=${() => this.#removeArrayValue(idx)}
            label="Remove"
            >Remove</uui-button
          >
        </div>`;
      })}

      <workflow-add-button
        @click=${this.#addStatus}
        .labelKey=${"workflow_addStatus"}
      ></workflow-add-button>`;
  }

  static styles = [
    css`
      #statusWrapper {
        display: flex;
        margin-bottom: var(--uui-size-space-3);
      }

      uui-select {
        flex: 1;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowStatusFilterElement;
  }
}
