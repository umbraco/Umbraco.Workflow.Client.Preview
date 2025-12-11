import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbCollectionDefaultElement } from "@umbraco-cms/backoffice/collection";
import { WorkflowDetailModalRouterController } from "@umbraco-workflow/core";

import "./active-workflows-collection-header.element.js";

const elementName = "workflow-active-workflows-collection";

@customElement(elementName)
export class WorkflowActiveWorkflowsCollectionElement extends UmbCollectionDefaultElement {
  constructor() {
    super();

    new WorkflowDetailModalRouterController(this);
  }

  protected override renderToolbar() {
    return html`<workflow-active-workflows-collection-header
      slot="header"
    ></workflow-active-workflows-collection-header>`;
  }
}

export { WorkflowActiveWorkflowsCollectionElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowActiveWorkflowsCollectionElement;
  }
}
