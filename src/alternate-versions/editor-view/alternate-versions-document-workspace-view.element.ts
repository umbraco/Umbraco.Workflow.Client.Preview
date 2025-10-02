import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbCollectionConfiguration } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS } from "../constants.js";

const elementName = "alternate-versions-document-workspace-view";

@customElement(elementName)
export class WorkflowAlternateVersionsDocumentWorkspaceViewElement extends UmbLitElement {
  #collectionConfig: UmbCollectionConfiguration = {
    pageSize: 10,
  };

  render() {
    return html`<umb-collection
      alias=${WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS}
      .config=${this.#collectionConfig}
    ></umb-collection>`;
  }
}

export default WorkflowAlternateVersionsDocumentWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionsDocumentWorkspaceViewElement;
  }
}
