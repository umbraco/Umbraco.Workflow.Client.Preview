import {
  css,
  customElement,
  html,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowConfigBoxBase } from "./index.js";
import type { WorkflowRefGroupPermissionElement } from "@umbraco-workflow/components";
import { add, remove } from "@umbraco-workflow/components";
import { PermissionType } from "@umbraco-workflow/enums";
import { ConfigService } from "@umbraco-workflow/generated";

const elementName = "workflow-config-content";

@customElement(elementName)
export class WorkflowConfigContentElement extends WorkflowConfigBoxBase {
  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    super();

    this.#host = host;

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalManagerContext = instance;
    });
  }

  async #openGroupPicker() {
    this.workflowManagerContext?.setNodePermissions([
      ...(await add(
        this.#host,
        this.permissions.node,
        this.workflowManagerContext?.getEntityId(),
        undefined,
        this.#modalManagerContext,
        { variant: this.variant }
      )),
    ]);
  }

  #remove(idx: number) {
    this.workflowManagerContext?.setNodePermissions([
      ...remove(this.permissions.node, idx),
    ]);
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
          permissions: this.permissions.node,
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

  #handleApprovalThresholdChange(event: Event) {
    const detail = (event.target as WorkflowRefGroupPermissionElement).value;
    const permissions = structuredClone(this.permissions?.node ?? []);
    const idx = permissions.findIndex(
      (x) => x.permission === detail?.permission
    );

    if (idx === -1) {
      return;
    }

    permissions[idx].approvalThreshold =
      detail?.approvalThreshold ??
      this.workflowManagerContext!.settings!.approvalThreshold ??
      0;

    this.workflowManagerContext?.setNodePermissions(permissions);
  }

  render() {
    return html`<uui-box
      class=${this.activeType === PermissionType.NODE ||
      this.activeType == PermissionType.NEW
        ? "active"
        : ""}
      headline=${this.localize.term("workflow_contentApprovalFlow")}
    >
      ${this.renderActiveBadge(PermissionType.NODE)}
      ${when(
        this.workflowManagerContext?.isNew,
        () => html`
          <workflow-alert key="workflow_newNodeConfig"> </workflow-alert>
        `
      )}
      ${when(
        this.workflowManagerContext?.isNew &&
          this.hasLength(this.permissions?.new),
        () => html`
          <alert-workflow
            style="display:block; margin-top:var(--uui-size-space-5)"
          >
            ${this.localize.term("workflow_newNodeApprovalFlowDescription")}
            <uui-ref-list>
              ${this.permissions?.new?.map(
                (permission) =>
                  html`<workflow-ref-group-permission
                    .name=${permission.groupName!}
                    .stage=${permission.permission}
                  >
                  </workflow-ref-group-permission>`
              )}
            </uui-ref-list>
          </alert-workflow>
        `
      )}
      ${when(
        !this.workflowManagerContext?.isNew,
        () => html`${when(
            this.hasLength(this.permissions?.node),
            () => html`
              <uui-ref-list>
                ${this.permissions?.node?.map(
                  (permission, idx) =>
                    html`<workflow-ref-group-permission
                      .value=${permission}
                      ?linked=${true}
                      ?canRemove=${true}
                      ?canConfigureApprovalThreshold=${this
                        .workflowManagerContext!.settings
                        ?.configureApprovalThreshold}
                      .defaultApprovalThreshold=${this.workflowManagerContext!
                        .settings?.approvalThreshold}
                      @approvalThresholdChange=${this
                        .#handleApprovalThresholdChange}
                      @remove=${() => this.#remove(idx)}
                    >
                    </workflow-ref-group-permission>`
                )}
              </uui-ref-list>
            `
          )}

          <workflow-add-button
            @click=${this.#openGroupPicker}
            .labelKey=${"workflow_addWorkflowGroups"}
          >
          </workflow-add-button>

          <div id="action-buttons">
            <uui-button
              color="positive"
              look="primary"
              @click=${this.#save}
              label="Save"
            >
              ${this.localize.term("buttons_save")}
            </uui-button>
            <uui-button
              color="danger"
              look="primary"
              @click=${this.#removeAll}
              ?disabled=${!this.hasLength(this.permissions?.node)}
              label="Remove all"
            >
              ${this.localize.term("workflow_removeAll")}
            </uui-button>
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfigContentElement;
  }
}
