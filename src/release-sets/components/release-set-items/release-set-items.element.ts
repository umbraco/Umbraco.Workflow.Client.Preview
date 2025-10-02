import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbCollectionConfiguration } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS } from './constants.js';
import { WorkflowReleaseSetItemCollectionContext } from "./release-set-item-collection.context.js";

const elementName = "workflow-release-set-items";

@customElement(elementName)
export class WorkflowReleaseSetItemsElement extends UmbLitElement {
  #collectionConfig: UmbCollectionConfiguration = {
    pageSize: 10,
  };

  constructor() {
    super();
    new WorkflowReleaseSetItemCollectionContext(this);
  }

  render() {
    return html`<umb-collection
      alias=${WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS}
      .config=${this.#collectionConfig}
    ></umb-collection>`;
  }
}

export default WorkflowReleaseSetItemsElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetItemsElement;
  }
}
