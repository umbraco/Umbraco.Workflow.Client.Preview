import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {
  partialUpdateFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import type { WorkflowBaseFilterElement } from "../elements/base-filter.element.js";
import type { Filter, WorkflowFilterConfig } from "../types.js";
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
  @state()
  private _config?: WorkflowFilterConfig;

  connectedCallback() {
    super.connectedCallback();
    this._config = structuredClone(this.data?.config);
  }

  #handleClear() {
    this._config?.filters.forEach((f) => {
      const original = this._config?.filters.find((x) => x.alias === f.alias);
      f.value = original?.default;
    });
    this.requestUpdate();
  }

  #handleSubmit() {
    this.value = { config: this._config };
    this.modalContext?.submit();
  }

  #renderFilterPickerElement<FilterType>(filter: Filter<FilterType>) {
    if (filter.disabled || !filter.ui) return;

    const el = document.createElement(
      filter.ui
    ) as WorkflowBaseFilterElement<FilterType>;

    el.alias = filter.alias;
    el.value = filter.value ?? filter.default;
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
    if (!this._config?.filters) return;

    const filterElement = e.target as WorkflowBaseFilterElement<T>;
    const alias = filterElement.alias;
    if (!alias) return;

    this._config.filters = partialUpdateFrozenArray(
      this._config.filters,
      { ...filter, ...{ value: filterElement.value } },
      (x) => x.alias === alias
    );
  }

  render() {
    return html`
      <umb-body-layout headline="Filter picker">
        <div id="main">
          <uui-box>
            ${this._config?.filters.map((filter) =>
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
            @click=${this.#handleSubmit}
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
