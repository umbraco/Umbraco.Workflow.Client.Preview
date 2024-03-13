import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "approval-groups-table-email-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableEmailColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: {
    users: Array<{ email: string }>;
    groupEmail?: string;
  };

  #getEmail() {
    if (this.value.groupEmail) {
      return this.value.groupEmail;
    }

    return this.value.users
      .map((v) => v.email)
      .filter((x) => x)
      .join(";");
  }

  render() {
    if (!this.value.users.length && !this.value.groupEmail) return nothing;

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
