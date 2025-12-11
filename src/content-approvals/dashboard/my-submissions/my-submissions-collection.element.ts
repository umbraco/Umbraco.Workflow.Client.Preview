import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbCollectionDefaultElement } from "@umbraco-cms/backoffice/collection";

import "./my-submissions-collection-header.element.js";

const elementName = "workflow-my-submissions-collection";

@customElement(elementName)
export class WorkflowMySubmissionsCollectionElement extends UmbCollectionDefaultElement {
  protected override renderToolbar() {
    return html`<workflow-my-submissions-collection-header
      slot="header"
    ></workflow-my-submissions-collection-header>`;
  }

  firstUpdated() {
    const layout = this.shadowRoot?.querySelector("umb-body-layout");
    const style = document.createElement("style");
    style.textContent = "#header { box-shadow: none !important; }";

    layout?.shadowRoot?.appendChild(style);
  }
}

export { WorkflowMySubmissionsCollectionElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowMySubmissionsCollectionElement;
  }
}
