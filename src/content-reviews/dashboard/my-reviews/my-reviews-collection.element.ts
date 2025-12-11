import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbCollectionDefaultElement } from "@umbraco-cms/backoffice/collection";

import "./my-reviews-collection-header.element.js";

const elementName = "workflow-my-reviews-collection";

@customElement(elementName)
export class WorkflowMyReviewsCollectionElement extends UmbCollectionDefaultElement {
  protected override renderToolbar() {
    return html`<workflow-my-reviews-collection-header
      slot="header"
    ></workflow-my-reviews-collection-header>`;
  }

  firstUpdated() {
    const layout = this.shadowRoot?.querySelector("umb-body-layout");
    const style = document.createElement("style");
    style.textContent = "#header { box-shadow: none !important; }";

    layout?.shadowRoot?.appendChild(style);
  }
}

export { WorkflowMyReviewsCollectionElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowMyReviewsCollectionElement;
  }
}
