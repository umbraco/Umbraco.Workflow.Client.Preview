import {
  css,
  html,
  customElement,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import type { WorkflowPermissionModel } from "../../../types.js";
import { WorkflowApprovalGroupWorkspaceViewBase } from "./approval-group-workspace-view-base.element.js";

const elementName = "workflow-approval-group-roles-workspace-view";

@customElement(elementName)
export class ApprovalGroupRolesWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBase
  implements UmbWorkspaceViewElement
{  
  async connectedCallback() {
    super.connectedCallback();
    await this.init;
  }
  
  #edit() {
    alert("edit");
  }  

  #renderList(items: Array<WorkflowPermissionModel>) {
    return html` <uui-ref-list>
      ${repeat(
        items,
        (permission) => permission.groupId,
        (permission) => html`<workflow-ref-group-permission
          .name=${permission.nodeId
            ? permission.nodeName!
            : permission.contentTypeName!}
          .stage=${permission.permission}
        >
          <uui-action-bar slot="actions">
            <uui-button label="Edit" @click=${this.#edit}></uui-button>
          </uui-action-bar>
        </workflow-ref-group-permission>`
      )}
    </uui-ref-list>`;
  }

  render() {
    const nodePermissions =
      this._group?.permissions?.filter((x) => x.nodeId !== 0).map((x) => x) ??
      [];

    const typePermissions =
      this._group?.permissions
        ?.filter((x) => x.contentTypeId !== 0)
        .map((x) => x) ?? [];

    return html`<uui-box
        headline=${this.localize.term("workflow_contentWorkflowRoles")}
      >
        ${when(
          nodePermissions.length,
          () => this.#renderList(nodePermissions),
          () => this.localize.term("content_noItemsToShow")
        )}
      </uui-box>
      <uui-box headline=${this.localize.term("workflow_documentTypeWorkflowRoles")}>
        ${when(
          typePermissions.length,
          () => this.#renderList(typePermissions),
          () => this.localize.term("content_noItemsToShow")
        )}
      </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }

      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default ApprovalGroupRolesWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupRolesWorkspaceViewElement;
  }
}
