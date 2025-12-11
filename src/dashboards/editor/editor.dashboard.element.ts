import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  WORKFLOW_MYSUBMISSIONS_COLLECTION_ALIAS,
  WORKFLOW_MYTASKS_COLLECTION_ALIAS,
} from "@umbraco-workflow/content-approvals";
import { WORKFLOW_MYREVIEWS_COLLECTION_ALIAS } from "@umbraco-workflow/content-reviews";

const elementName = "workflow-editor-dashboard";

@customElement(elementName)
export class EditorDashboardElement extends UmbLitElement {
  render() {
    return html`<umb-collection
        alias=${WORKFLOW_MYTASKS_COLLECTION_ALIAS}
      ></umb-collection>

      <umb-collection
        alias=${WORKFLOW_MYSUBMISSIONS_COLLECTION_ALIAS}
      ></umb-collection>

      <umb-collection
        alias=${WORKFLOW_MYREVIEWS_COLLECTION_ALIAS}
      ></umb-collection> `;
  }

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];
}

export default EditorDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: EditorDashboardElement;
  }
}
