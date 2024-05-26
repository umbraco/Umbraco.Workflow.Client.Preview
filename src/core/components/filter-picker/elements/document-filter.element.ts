import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import type { UmbInputDocumentElement } from "@umbraco-cms/backoffice/document";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";

const elementName = "workflow-document-filter";

@customElement(elementName)
export class WorkflowDocumentFilterElement extends WorkflowBaseFilterElement<string> {
  #onSelectionChange(event: CustomEvent) {
    this.setValue(
      (event.target as UmbInputDocumentElement).selection.join(",")
    );
  }

  render() {
    return html` <umb-input-document
      .min=${0}
      .max=${1}
      .value=${this.value ?? ""}
      @change=${this.#onSelectionChange}
    ></umb-input-document>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDocumentFilterElement;
  }
}
