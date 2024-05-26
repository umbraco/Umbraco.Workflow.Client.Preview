import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { WorkflowFilterConfig } from "./types.js";
import { WorkflowFilterPickerContext } from "./workflow-filterpicker-context.js";
import type { FilterModel } from "@umbraco-workflow/generated";

const elementName = "workflow-filter-picker";

@customElement(elementName)
export class FilterPickerElement extends UmbElementMixin(LitElement) {
  @property({ type: Object })
  config?: WorkflowFilterConfig;

  @state()
  filterCount?: number;

  value?: FilterModel;
  #filterPickerContext = new WorkflowFilterPickerContext(this);

  constructor() {
    super();

    this.observe(
      this.#filterPickerContext.filters,
      (filterValues) => {
        this.value = filterValues;
        this.dispatchEvent(new CustomEvent("change"));
      },
      "workflowFilterPickerValueObserver"
    );

    this.observe(
      this.#filterPickerContext.activeCount,
      (count) => (this.filterCount = count),
      "workflowFilterPickerCountObserver"
    );
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.config) {
      this.#filterPickerContext.setConfig(this.config);
    }
  }

  render() {
    return html` <uui-button
      look="outline"
      color="default"
      label="filters"
      @click=${() => this.#filterPickerContext.openPicker()}
    >
      <span>${this.localize.term("workflow_filters")}:</span>
      <span>${this.filterCount}</span>
    </uui-button>`;
  }
}

export default FilterPickerElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: FilterPickerElement;
  }
}
