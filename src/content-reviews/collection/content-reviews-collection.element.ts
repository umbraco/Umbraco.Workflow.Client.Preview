import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbCollectionDefaultElement } from "@umbraco-cms/backoffice/collection";

import "./content-reviews-collection-header.element.js";

const elementName = "workflow-content-reviews-collection";

@customElement(elementName)
export class WorkflowContentReviewsCollectionElement extends UmbCollectionDefaultElement {
  protected override renderToolbar() {
    return html`<workflow-content-reviews-collection-header
      slot="header"
    ></workflow-content-reviews-collection-header>`;
  }
}

export { WorkflowContentReviewsCollectionElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsCollectionElement;
  }
}
