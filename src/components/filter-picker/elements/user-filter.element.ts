import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import type { UmbInputDocumentElement } from "@umbraco-cms/backoffice/document";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-user-filter";

@customElement(elementName)
export class WorkflowUserFilterElement extends WorkflowBaseFilterElement<string> {
  #onSelectionChange(event: CustomEvent) {
    this.setValue(
      (event.target as UmbInputDocumentElement).selection.join(",")
    );
  }

  render() {
    return html`<umb-user-input
      .value=${this.value}
      @change=${this.#onSelectionChange}
    ></umb-user-input>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowUserFilterElement;
  }
}
