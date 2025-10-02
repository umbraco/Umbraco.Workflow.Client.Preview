import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-status-filter";

@customElement(elementName)
export class WorkflowStatusFilterElement extends WorkflowBaseFilterElement<
  Array<number>
> {
  #removeArrayValue(idx: number) {
    this.value = this.value ?? [];
    this.value = [...this.value.slice(0, idx), ...this.value.slice(idx + 1)];
    this.setValue(this.value ?? []);
  }

  #updateArrayValue(e: InputEvent, idx: number) {
    this.value = this.value ?? [];

    this.value = [
      ...this.value.slice(0, idx),
      Number((e.target as HTMLInputElement).value),
      ...this.value.slice(idx + 1),
    ];

    this.setValue(this.value);
  }

  #addStatus() {
    this.value = this.value ? [...this.value, 0] : [0];
  }

  render() {
    return html` ${this.value?.map((value, idx) => {
        const statusValues =
          this.options?.map((o) => ({
            ...o,
            ...{
              selected: +o.value === value,
              disabled: this.value?.includes(+o.value),
            },
          })) ?? [];

        return html`<div id="statusWrapper">
          <uui-select
            .options=${statusValues}
            @change=${(e: InputEvent) => this.#updateArrayValue(e, idx)}
          ></uui-select
          ><uui-button
            @click=${() => this.#removeArrayValue(idx)}
            label=${this.localize.term("general_remove")}
          ></uui-button>
        </div>`;
      })}

      <uui-button
        look="placeholder"
        @click=${this.#addStatus}
        .label=${this.localize.term("workflow_addStatus")}
      ></uui-button>`;
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

      [look="placeholder"] {
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowStatusFilterElement;
  }
}
