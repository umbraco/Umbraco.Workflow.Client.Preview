import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";
import type { WorkflowDateRangeElement } from "@umbraco-workflow/components";

const elementName = "workflow-daterange-filter";

@customElement(elementName)
export class WorkflowDateRangeFilterElement extends WorkflowBaseFilterElement<
  Array<string>
> {
  #setValue(e: CustomEvent) {
    this.setValue((e.target as WorkflowDateRangeElement).dates);
  }

  render() {
    return html`<workflow-daterange
      .dates=${this.value ?? ["", ""]}
      @change=${this.#setValue}
    ></workflow-daterange>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDateRangeFilterElement;
  }
}
