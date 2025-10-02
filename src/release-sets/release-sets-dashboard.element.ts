import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_RELEASESETS_COLLECTION_ALIAS } from "./collection/constants.js";

const elementName = "workflow-release-sets-dashboard";

@customElement(elementName)
export class ReleaseSetsDashboardElement extends UmbLitElement {
  render() {
    return html`
      <umb-collection
        alias=${WORKFLOW_RELEASESETS_COLLECTION_ALIAS}
      ></umb-collection>
    `;
  }
}

export default ReleaseSetsDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ReleaseSetsDashboardElement;
  }
}
