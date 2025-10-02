import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { ApprovalGroupCollectionMemberResponseModel } from "@umbraco-workflow/generated";

const elementName = "approval-groups-table-email-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableEmailColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: {
    members: Array<ApprovalGroupCollectionMemberResponseModel>;
    groupEmail?: string;
  };

  #getEmail() {
    if (this.value.groupEmail) {
      return this.value.groupEmail;
    }

    return this.value.members
      .map((v) => v.email)
      .filter((x) => x)
      .join(";");
  }

  render() {
    if (!this.value.members.length && !this.value.groupEmail) return nothing;

    return html` <uui-button
      look="secondary"
      color="default"
      label="Email group"
      href="mailto:${this.#getEmail()}"
      compact
      target="_blank"
      ><uui-icon name="icon-message"></uui-icon>
    </uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableEmailColumnLayoutElement;
  }
}

export default ApprovalGroupsTableEmailColumnLayoutElement;
