import {
  css,
  html,
  customElement,
  repeat,
  when,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "@umbraco-workflow/settings";
import { WorkflowApprovalGroupWorkspaceViewBaseElement } from "./approval-group-workspace-view-base.element.js";
import type { ApprovalGroupDetailPermissionResponseModel } from "@umbraco-workflow/generated";
import { WorkflowWorkspaceModalRouterController } from "@umbraco-workflow/core";

type EntityType = ApprovalGroupDetailPermissionResponseModel;

const elementName = "workflow-approval-group-roles-workspace-view";

@customElement(elementName)
export class ApprovalGroupRolesWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBaseElement
  implements UmbWorkspaceViewElement
{
  @state()
  private _documentPermissions: Array<EntityType> = [];

  @state()
  private _typePermissions: Array<EntityType> = [];

  @state()
  private _editDocumentPath?: string;

  @state()
  private _editDocumentTypePath?: string;

  async connectedCallback() {
    super.connectedCallback();
    await this.init;

    this._group?.permissions.forEach((p) => {
      p.documentPermission
        ? this._documentPermissions.push(p)
        : !p.newDocumentPermission
        ? this._typePermissions.push(p)
        : {};
    });

    this._editDocumentPath = await firstValueFrom(
      new WorkflowWorkspaceModalRouterController(this, UMB_DOCUMENT_ENTITY_TYPE).path
    );
    this._editDocumentTypePath = await firstValueFrom(
      new WorkflowWorkspaceModalRouterController(this, WORKFLOW_SETTINGS_ENTITY_TYPE).path
    );

    this.requestUpdate();
  }

  async #edit(permission: EntityType) {
    if (!permission.documentPermission) {
      this.#editDocumentTypePermission();
    } else {
      this.#editDocumentPermission(permission);
    }
  }

  async #editDocumentTypePermission() {
    window.history.pushState(null, "", this._editDocumentTypePath);
  }

  async #editDocumentPermission(permission: EntityType) {
    const url = `${this._editDocumentPath}edit/${permission.unique}/${permission.culture}/view/workflow`;
    window.history.pushState(null, "", url);
  }

  #renderList(items: Array<EntityType>) {
    return html` <uui-ref-list>
      ${repeat(
        items,
        (permission) => html`<workflow-ref-entity-permission
          .name=${permission.name ?? ""}
        >
          <umb-icon
            slot="icon"
            .name=${permission.icon ?? "icon-document"}
          ></umb-icon>
          <span slot="detail"
            >${this.localize.term("workflow_stage", permission.permission + 1)}
            | ${permission.culture}</span
          >
          <uui-action-bar slot="actions">
            <uui-button
              label="Edit"
              @click=${() => this.#edit(permission)}
            ></uui-button>
          </uui-action-bar>
        </workflow-ref-entity-permission>`
      )}
    </uui-ref-list>`;
  }

  render() {
    return html`<uui-box
        headline=${this.localize.term("workflow_documentWorkflowRoles")}
      >
        ${when(
          this._documentPermissions.length,
          () => this.#renderList(this._documentPermissions),
          () => this.localize.term("content_noItemsToShow")
        )}
      </uui-box>
      <uui-box
        headline=${this.localize.term("workflow_documentTypeWorkflowRoles")}
      >
        ${when(
          this._typePermissions.length,
          () => this.#renderList(this._typePermissions),
          () => this.localize.term("content_noItemsToShow")
        )}
      </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
        column-gap: var(--uui-size-space-6);
        padding: var(--uui-size-space-6);
      }

      uui-box {
        flex: 1;
        align-self: flex-start;
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
