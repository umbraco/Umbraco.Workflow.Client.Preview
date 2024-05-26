import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "approval-groups-table-name-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableNameColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: {
    name: string;
    key: string;
  };

  render() {
    if (!this.value) return nothing;

    return html`<a
      href="section/workflow/workspace/approval-group/edit/${this.value.key}"
      >${this.value.name}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableNameColumnLayoutElement;
  }
}
