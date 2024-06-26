import {
  css,
  customElement,
  html,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { WorkflowConfigBoxBase } from "./index.js";
import { PermissionType } from "@umbraco-workflow/core";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/approval-group";
import { ConfigService } from "@umbraco-workflow/generated";

const elementName = "workflow-config-content";

@customElement(elementName)
export class WorkflowConfigContentElement extends WorkflowConfigBoxBase {
  async #onApprovalGroupsUpdated(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;
    this.workflowManagerContext?.setNodePermissions(target.selectedPermissions);
  }

  async #save() {
    if (!this.workflowManagerContext)
      throw new Error("workflow manager context is missing");

    // TODO => fix the model or ensure all properties do actually exist
    const { error } = await tryExecuteAndNotify(
      this,
      ConfigService.putConfig({
        requestBody: {
          key: this.workflowManagerContext.getEntityId()!,
          id: 1,
          permissions: this.permissions?.node ?? [],
          variant: this.variant!,
        },
      })
    );

    if (!error) {
      this.workflowManagerContext?.happy(`Configuration updated`);
    }
  }

  #removeAll() {
    this.workflowManagerContext?.setNodePermissions([]);
  }

  render() {
    return html`<uui-box
      class=${this.activeType === PermissionType.NODE ||
      this.activeType == PermissionType.NEW
        ? "active"
        : ""}
      headline=${this.localize.term("workflow_contentApprovalFlow")}
    >
      ${this.renderActiveBadge(PermissionType.NODE, PermissionType.NEW)}
      ${when(
        !this.workflowManagerContext?.isSaved,
        () => html`
          <workflow-alert key="workflow_newNodeConfig"> </workflow-alert>
        `
      )}
      ${when(
        this.workflowManagerContext?.isNew && this.permissions?.new.length,
        () => html`
          <p>
            ${this.localize.term("workflow_newNodeApprovalFlowDescription")}
          </p>
          <uui-ref-list>
            ${this.permissions?.new?.map(
              (permission) =>
                html`<workflow-ref-group-permission .value=${permission}>
                </workflow-ref-group-permission>`
            )}
          </uui-ref-list>
        `
      )}
      ${when(
        this.workflowManagerContext?.isSaved,
        () => html` <workflow-approval-group-input
            .config=${{
              multiple: true,
              document: this.workflowManagerContext!.getEntityId(),
              remove: true,
              defaultThreshold: this.globalVariables?.defaultApprovalThreshold,
              configureThreshold:
                this.globalVariables?.configureApprovalThreshold,
              additionalData: {
                variant: this.variant,
              },
            }}
            .selectedPermissions=${this.permissions?.node ?? []}
            @updated=${this.#onApprovalGroupsUpdated}
          ></workflow-approval-group-input>

          <div id="action-buttons">
            <uui-button
              color="positive"
              look="primary"
              @click=${this.#save}
              label=${this.localize.term("buttons_save")}
            ></uui-button>
            <uui-button
              color="danger"
              look="primary"
              @click=${this.#removeAll}
              ?disabled=${!this.permissions?.node.length}
              label=${this.localize.term("workflow_removeAll")}
            ></uui-button>
          </div>`
      )}
    </uui-box>`;
  }

  static styles = [
    ...WorkflowConfigBoxBase.styles,
    css`
      #action-buttons {
        margin-top: var(--uui-size-space-5);
        display: flex;
        flex-direction: row-reverse;
        gap: var(--uui-size-space-2);
      }

      uui-ref-list {
        margin-bottom: var(--uui-size-6);
        border-bottom: 1px solid var(--uui-color-border);
        pointer-events: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfigContentElement;
  }
}
