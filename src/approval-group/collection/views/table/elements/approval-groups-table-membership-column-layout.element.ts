import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  nothing,
  property,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { ApprovalGroupCollectionMemberResponseModel } from "@umbraco-workflow/generated";

const elementName = "approval-groups-table-membership-column-layout";

@customElement(elementName)
export class ApprovalGroupsTableMembershipColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: {
    members: Array<ApprovalGroupCollectionMemberResponseModel>;
  };

  render() {
    if (!this.value?.members?.length) return nothing;

    return html` <uui-ref-list>
        ${repeat(
          this.value.members.length > 4
            ? this.value.members.slice(0, 3)
            : this.value.members,
          (member) => member,
          (member) => html`
            <uui-ref-node-user
              name=${member.name ?? ""}
              group-name=${member.inherited
                ? this.localize.term("workflow_inherited")
                : ""}
            >
            </uui-ref-node-user>
          `
        )}
      </uui-ref-list>
      ${when(
        this.value.members!.length > 4,
        () =>
          html`<uui-tag
            >${this.localize.term(
              "workflow_plusMore",
              this.value.members.length - 3
            )}</uui-tag
          >`
      )}`;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      padding: var(--uui-size-3) 0;
    }
    uui-tag {
      margin-left: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableMembershipColumnLayoutElement;
  }
}

export default ApprovalGroupsTableMembershipColumnLayoutElement;
