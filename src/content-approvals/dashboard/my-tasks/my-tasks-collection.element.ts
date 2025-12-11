import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbCollectionDefaultElement } from "@umbraco-cms/backoffice/collection";

import "./my-tasks-collection-header.element.js";

const elementName = "workflow-my-tasks-collection";

@customElement(elementName)
export class WorkflowMyTasksCollectionElement extends UmbCollectionDefaultElement {
  protected override renderToolbar() {
    return html`<workflow-my-tasks-collection-header
      slot="header"
    ></workflow-my-tasks-collection-header>`;
  }

  firstUpdated() {
    const layout = this.shadowRoot?.querySelector("umb-body-layout");
    const style = document.createElement("style");
    style.textContent = "#header { box-shadow: none !important; }";

    layout?.shadowRoot?.appendChild(style);
  }
}

export { WorkflowMyTasksCollectionElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowMyTasksCollectionElement;
  }
}
