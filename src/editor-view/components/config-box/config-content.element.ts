import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { WorkflowConfigBoxBaseElement } from "./index.js";
import { PermissionType } from "@umbraco-workflow/core";
import type { WorkflowApprovalGroupInputElement } from "@umbraco-workflow/approval-group";
import {
  ApprovalThresholdModel,
  ConfigService,
} from "@umbraco-workflow/generated";
import {
  WORKFLOW_CONTEXT,
} from "@umbraco-workflow/context";
import { WORKFLOW_SECTION_ALIAS } from "src/constants.js";

const elementName = "workflow-config-content";

@customElement(elementName)
export class WorkflowConfigContentElement extends WorkflowConfigBoxBaseElement {
  @state()
  defaultApprovalThreshold = ApprovalThresholdModel.ONE;

  @state()
  configureApprovalThreshold = false;

  @state()
  private _readonly = true;

  constructor() {
    super();

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.currentUser, (currentUser) => {
        if (!currentUser) return;

        this._readonly =
          currentUser?.allowedSections?.includes(WORKFLOW_SECTION_ALIAS) !==
          true;
      });
    });

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      const globalVariables = context?.getVariables();
      if (!globalVariables) return;

      this.defaultApprovalThreshold = globalVariables.defaultApprovalThreshold;
      this.configureApprovalThreshold =
        globalVariables.configureApprovalThreshold;
    });
  }

  async #save() {
    if (!this.workflowManagerContext)
      throw new Error("workflow manager context is missing");

    const key = this.workflowManagerContext.getEntityId();
    if (!key) return;

    await tryExecute(
      this,
      ConfigService.putConfig({
        body: {
          key,
          permissions: this.workflowManagerContext.getPermissions()?.node ?? [],
          variant: this.variant,
        },
      })
    );

    this.workflowManagerContext.refreshScaffold();
  }

  async #onSelectionChange(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;
    this.workflowManagerContext?.setNodePermissions(target.selectedPermissions);
  }

  #onRemoveAll() {
    this.workflowManagerContext?.setNodePermissions([]);
    this.#save();
  }

  render() {
    return html`<uui-box
      class=${this.activeType === PermissionType.NODE ||
      this.activeType == PermissionType.NEW
        ? "active"
        : ""}
      headline=${this.localize.term("workflow_documentApprovalFlow")}
    >
      ${this.renderActiveBadge(PermissionType.NODE, PermissionType.NEW)}
      ${when(
        !this.workflowManagerContext?.getIsPublished() &&
          this.permissions?.new.length,
        () => html`
          <div id="newNodeApprovalFlow">
            <p>
              ${this.localize.term(
                "workflow_settings_newNodeApprovalFlowDescription"
              )}
            </p>
            <uui-ref-list>
              ${this.permissions?.new?.map(
                (permission) =>
                  html`<workflow-ref-group-permission .value=${permission}>
                    <umb-icon
                      slot="icon"
                      .name=${permission.icon ?? "icon-users"}
                    ></umb-icon>
                  </workflow-ref-group-permission>`
              )}
            </uui-ref-list>
          </div>
        `
      )}
      <workflow-approval-group-input
        .config=${{
          emptyLabel: this.localize.term("workflow_noDocumentFlow"),
          edit: true,
          multiple: true,
          document: this.workflowManagerContext!.getEntityId(),
          remove: true,
          defaultThreshold: this.defaultApprovalThreshold,
          configureThreshold: this.configureApprovalThreshold,
          additionalData: {
            variant: this.variant,
          },
        }}
        @change=${this.#onSelectionChange}
        .selectedPermissions=${this.permissions?.node ?? []}
        ?readonly=${this._readonly}
      >
      </workflow-approval-group-input>

      <div id="action-buttons">
        <uui-button
          color="danger"
          look="primary"
          @click=${this.#onRemoveAll}
          ?disabled=${this._readonly || !this.permissions?.node.length}
          label=${this.localize.term("workflow_removeAll")}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          @click=${this.#save}
          label=${this.localize.term("buttons_save")}
          ?disabled=${this._readonly || !this.permissions?.node.length}
        ></uui-button>
      </div>
    </uui-box>`;
  }

  static styles = [
    ...WorkflowConfigBoxBaseElement.styles,
    css`
      #action-buttons {
        margin-top: var(--uui-size-space-5);
        display: flex;
        gap: var(--uui-size-space-2);
        justify-content: flex-end;
      }

      #newNodeApprovalFlow {
        margin-bottom: var(--uui-size-2);
        padding-bottom: var(--uui-size-5);
        border-bottom: 1px solid var(--uui-color-divider-standalone);

        p {
          margin: 0 0 var(--uui-size-1);
        }
      }

      uui-ref-list {
        margin-bottom: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfigContentElement;
  }
}
