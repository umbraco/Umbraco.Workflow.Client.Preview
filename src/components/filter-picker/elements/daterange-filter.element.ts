import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";
import type { WorkflowDateRangeElement } from "@umbraco-workflow/components";
import type { DateRangeModel } from "@umbraco-workflow/generated";

const elementName = "workflow-daterange-filter";

@customElement(elementName)
export class WorkflowDateRangeFilterElement extends WorkflowBaseFilterElement<DateRangeModel> {
  #setValue(e: CustomEvent) {
    const value = (e.target as WorkflowDateRangeElement).dates;
    this.setValue({ from: value[0], to: value[1] });
  }

  render() {
    return html`<workflow-daterange
      .dates=${[this.value?.from ?? "", this.value?.to ?? ""]}
      @change=${this.#setValue}
    ></workflow-daterange>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDateRangeFilterElement;
  }
}
