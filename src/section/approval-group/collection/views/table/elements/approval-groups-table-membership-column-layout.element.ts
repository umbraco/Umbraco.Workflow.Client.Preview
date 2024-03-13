import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  nothing,
  property,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "approval-groups-table-membership-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableMembershipColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: {
    users: Array<{name: string, inherited: boolean}>;
  };

  render() {
    if (!this.value?.users?.length) return nothing;

    return html` <ul>
      ${repeat(
        this.value.users.length > 4
          ? this.value.users.slice(0, 3)
          : this.value.users,
        (user) => user,
        (user) => html`
          <li>
            ${user.name}
            ${user.inherited
              ? ` (${this.localize.term("workflow_inherited")})`
              : ""}
          </li>
          ${when(
            this.value.users!.length > 4,
            () => html`<li>Plus ${this.value.users.length - 3} more</li>`
          )}
        `
      )}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableMembershipColumnLayoutElement;
  }
}
