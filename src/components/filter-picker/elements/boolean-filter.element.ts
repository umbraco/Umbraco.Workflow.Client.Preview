import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import type { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-boolean-filter";

@customElement(elementName)
export class WorkflowBooleanFilterElement extends WorkflowBaseFilterElement<boolean> {
  #setValue(e: UUIBooleanInputEvent) {
    this.setValue(e.target.checked);
  }

  render() {
    return html`<umb-input-toggle
      ?checked=${this.value}
      .value=${this.value}
      @change=${this.#setValue}
    ></umb-input-toggle>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowBooleanFilterElement;
  }
}
