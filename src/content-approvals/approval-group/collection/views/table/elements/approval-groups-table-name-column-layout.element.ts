import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "approval-groups-table-name-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableNameColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: {
    name: string;
    url: string;
  };

  render() {
    if (!this.value) return nothing;

    return html`<uui-button
      compact
      href=${this.value.url}
      label=${this.value.name}
    ></uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableNameColumnLayoutElement;
  }
}

export default ApprovalGroupsTableNameColumnLayoutElement;
