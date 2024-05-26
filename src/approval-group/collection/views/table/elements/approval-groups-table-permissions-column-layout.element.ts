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
import { type UserGroupPermissionsModel } from "@umbraco-workflow/generated";

type LabeledUserGroupPermissionModel = UserGroupPermissionsModel & {
  label?: string;
};

const elementName = "approval-groups-table-permissions-column-layout";

@customElement(elementName)
export class ApprovalGroupsTablePermissionsColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: {
    permissions: Array<UserGroupPermissionsModel>;
    languageCount: number;
  };

  #setLabels(
    permissions: Array<UserGroupPermissionsModel>
  ): Array<LabeledUserGroupPermissionModel> | undefined {
    return permissions.map((p) => {
      const type = p.contentTypeName ?? p.nodeName;
      let label = `${type} - stage ${p.permission! + 1}`;

      //check this is the only lang, add variant name if not
      if (this.value.languageCount > 1) {
        label += ` (${p.variant})`;
      }

      return { ...p, ...{ label } };
    });
  }

  render() {
    if (!this.value?.permissions?.length) return nothing;

    const permissions = this.#setLabels(this.value.permissions);
    if (!permissions || !permissions.length) return nothing;

    return html` <ul>
      ${repeat(
        permissions.length > 4 ? permissions.slice(0, 3) : permissions,
        (permission) => permission,
        (permission) => html` <li>${permission.label}</li> `
      )}
      ${when(
        permissions.length > 4,
        () => html`<li>Plus ${permissions.length - 3} more</li>`
      )}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTablePermissionsColumnLayoutElement;
  }
}
