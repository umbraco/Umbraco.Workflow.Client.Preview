import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-select-filter";

@customElement(elementName)
export class WorkflowSelectFilterElement extends WorkflowBaseFilterElement<string> {
  connectedCallback() {
    super.connectedCallback();

    this.options = this.options?.map((o) => ({
      ...o,
      ...{ selected: o.value === this.value },
    }));
  }

  #setValue(e: InputEvent) {
    this.setValue((e.target as HTMLInputElement).value);
  }

  render() {
    return html` <uui-select
        .options=${this.options ?? []}
        .value=${this.value}
        @change=${this.#setValue}
      ></uui-select>
      <uui-button
        @click=${this.#setValue}
        ?disabled=${!this.value}
        label=${this.localize.term("general_remove")}
      ></uui-button>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
      }

      uui-select {
        flex: 1;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSelectFilterElement;
  }
}
