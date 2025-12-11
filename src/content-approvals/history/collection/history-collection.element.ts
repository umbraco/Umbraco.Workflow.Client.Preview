import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbCollectionDefaultElement } from "@umbraco-cms/backoffice/collection";

import "./history-collection-header.element.js";

const elementName = "workflow-history-collection";

@customElement(elementName)
export class WorkflowHistoryCollectionElement extends UmbCollectionDefaultElement {
  protected override renderToolbar() {
    return html`<workflow-history-collection-header
      slot="header"
    ></workflow-history-collection-header>`;
  }
}

export { WorkflowHistoryCollectionElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryCollectionElement;
  }
}
