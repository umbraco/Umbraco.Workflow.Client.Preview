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
    unique: string;
  };

  render() {
    if (!this.value) return nothing;

    return html`<a
      href="section/workflow/workspace/approval-group/edit/${this.value.unique}"
      >${this.value.name}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableNameColumnLayoutElement;
  }
}

export default ApprovalGroupsTableNameColumnLayoutElement;
