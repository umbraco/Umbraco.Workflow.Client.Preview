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
import type { ApprovalGroupDetailPermissionResponseModel } from "@umbraco-workflow/generated";

const elementName = "approval-groups-table-permissions-column-layout";

@customElement(elementName)
export class ApprovalGroupsTablePermissionsColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: {
    permissions: Array<ApprovalGroupDetailPermissionResponseModel>;
  };

  #getEntityType(permission: ApprovalGroupDetailPermissionResponseModel) {
    if (permission.newDocumentPermission) return "new documents";
    return permission.documentPermission ? "document" : "document type";
  }

  render() {
    const permissions = this.value.permissions;
    if (!permissions.length) return nothing;

    return html` <uui-ref-list>
        ${repeat(
          permissions.length > 4 ? permissions.slice(0, 3) : permissions,
          (permission) => permission.unique,
          (permission) =>
            html`
              <workflow-ref-entity-permission .name=${permission.name ?? ""}>
                <umb-icon
                  slot="icon"
                  .name=${permission.icon ?? "icon-document"}
                ></umb-icon>
                <span slot="detail"
                  >${this.localize.term(
                    "workflow_stage",
                    permission.permission + 1
                  )}
                  | ${permission.culture} |
                  ${this.#getEntityType(permission)}</span
                >
              </workflow-ref-entity-permission>
            `
        )}
      </uui-ref-list>
      ${when(
        permissions.length > 4,
        () =>
          html`<uui-tag look="default"
            >${this.localize.term(
              "workflow_plusMore",
              permissions.length - 3
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
    [elementName]: ApprovalGroupsTablePermissionsColumnLayoutElement;
  }
}

export default ApprovalGroupsTablePermissionsColumnLayoutElement;
