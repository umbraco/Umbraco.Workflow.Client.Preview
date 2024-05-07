import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { Filter, WorkflowFilterConfig } from "../../index.js";
import type { WorkflowBaseFilterElement } from "../../components/filter-picker/elements/base-filter.element.js";
import type {
  WorkflowFilterPickerModalData,
  WorkflowFilterPickerModalResult,
} from "@umbraco-workflow/modal";

const elementName = "workflow-filter-picker-modal";

@customElement(elementName)
export class FilterPickerModalElement extends UmbModalBaseElement<
  WorkflowFilterPickerModalData,
  WorkflowFilterPickerModalResult
> {
  config?: WorkflowFilterConfig;

  connectedCallback() {
    super.connectedCallback();

    this.config = structuredClone(this.data?.config);
  }

  #handleClear() {
    this.config?.filters.forEach((f) => {
      const original = this.data?.config?.filters.find((x) => x.alias === f.alias);
      f.value = original?.default;
    });
    this.requestUpdate();
  }

  #handleSubmit() {
    this.value = { config: this.config };
    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
  }

  #renderFilterPickerElement<FilterType>(filter: Filter<FilterType>) {
    if (filter.disabled) return;

    const el = document.createElement(
      filter.ui
    ) as WorkflowBaseFilterElement<FilterType>;

    el.alias = filter.alias;
    el.value = filter.value ?? filter.default;
    el.onchange = (e) => this.#handleFilterValueChange(e);

    if (filter.options) {
      el.options = filter.options;
    }

    return html` <umb-property-layout
      .label=${this.localize.term(filter.labelKey)}
    >
      <div slot="editor">${el}</div>
    </umb-property-layout>`;
  }

  #handleFilterValueChange<T>(e: Event) {
    const filterElement = e.target as WorkflowBaseFilterElement<T>;
    const alias = filterElement.alias;
    if (!alias) return;

    const filter = this.config?.filters.find((f) => f.alias === alias);
    if (!filter) return;

    filter.value = filterElement.value;
  }

  render() {
    return html`
      <umb-body-layout headline="Filter picker">
        <div id="main">
          <uui-box>
            ${this.config?.filters.map((filter) =>
              this.#renderFilterPickerElement(filter)
            )}
          </uui-box>
        </div>

        <div slot="actions">
          <uui-button
            id="close"
            label="Close"
            @click="${this.#handleClose}"
          ></uui-button>
          <uui-button
            id="clear"
            label="Clear"
            look="primary"
            color="default"
            @click="${this.#handleClear}"
          ></uui-button>
          <uui-button
            id="submit"
            color="positive"
            look="primary"
            label="Submit"
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
