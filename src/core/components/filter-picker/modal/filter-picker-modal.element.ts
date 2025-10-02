import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { WorkflowBaseFilterElement } from "../elements/base-filter.element.js";
import type { Filter } from "../types.js";
import type {
  WorkflowFilterPickerModalData,
  WorkflowFilterPickerModalResult,
} from "./filter-picker-modal.token.js";

const elementName = "workflow-filter-picker-modal";

@customElement(elementName)
export class FilterPickerModalElement extends UmbModalBaseElement<
  WorkflowFilterPickerModalData,
  WorkflowFilterPickerModalResult
> {
  #handleClear() {
    Object.keys(this.value).forEach((key) => {
      const original = this.data?.config?.filters.find((x) => x.alias === key);
      this.value = { ...this.value, ...{ [key]: original?.default } };
    });
  }

  #renderFilterPickerElement<FilterType>(filter: Filter<FilterType>) {
    if (filter.disabled || !filter.ui) return;

    const el = document.createElement(
      filter.ui
    ) as WorkflowBaseFilterElement<FilterType>;

    el.alias = filter.alias;
    el.value = this.value[filter.alias] ?? filter.value ?? filter.default;
    el.onchange = (e) => this.#handleFilterValueChange<FilterType>(e, filter);

    if (filter.options) {
      el.options = filter.options;
    }

    return html` <umb-property-layout
      .label=${this.localize.term(filter.labelKey ?? "")}
    >
      <div slot="editor">${el}</div>
    </umb-property-layout>`;
  }

  #handleFilterValueChange<T>(e: Event, filter: Filter<T>) {
    const filterElement = e.target as WorkflowBaseFilterElement<T>;
    this.modalContext?.updateValue({ [filter.alias]: filterElement.value });
  }

  render() {
    return html`
      <umb-body-layout headline="Filter picker">
        <div id="main">
          <uui-box>
            ${this.data?.config?.filters.map((filter) =>
              this.#renderFilterPickerElement(filter)
            )}
          </uui-box>
        </div>

        <div slot="actions">
          <uui-button
            label=${this.localize.term("general_cancel")}
            @click=${this._rejectModal}
          ></uui-button>
          <uui-button
            label=${this.localize.term("general_clear")}
            look="primary"
            color="default"
            @click=${this.#handleClear}
          ></uui-button>
          <uui-button
            color="positive"
            look="primary"
            label=${this.localize.term("general_submit")}
            @click=${this._submitModal}
          ></uui-button>
        </div>
      </umb-body-layout>
    `;
  }

  static styles = [
    css`
      uui-scroll-container {
        overflow-y: scroll;
        max-height: 100%;
        min-height: 0;
        flex: 1;
      }
    `,
  ];
}

export default FilterPickerModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: FilterPickerModalElement;
  }
}
