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
import { ConfigService } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import { UUIButtonState } from "@umbraco-cms/backoffice/external/uui";
import {
  WORKFLOW_APPROVALGROUP_ICON,
  type WorkflowApprovalGroupInputElement,
} from "@umbraco-workflow/approval-group";
import { WORKFLOW_USER_PERMISSION_CONFIGURATION_UPDATE } from "../../../user-permissions/constants.js";
import { PermissionType } from "../../../enums.js";

const elementName = "workflow-config-content";

@customElement(elementName)
export class WorkflowConfigContentElement extends WorkflowConfigBoxBaseElement {
  @state()
  defaultApprovalThreshold = "One";

  @state()
  configureApprovalThreshold = false;

  @state()
  private _readonly = true;

  @state()
  private _buttonState?: UUIButtonState;

  constructor() {
    super();

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.fallbackPermissions, (fallbackPermissions) => {
        this._readonly = !fallbackPermissions?.includes(
          WORKFLOW_USER_PERMISSION_CONFIGURATION_UPDATE
        );
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

    this._buttonState = "waiting";

    const key = this.workflowManagerContext.getEntityId();
    if (!key) return;

    await tryExecute(
      this,
      ConfigService.putConfig({
        body: {
          key,
          entityType: this.workflowManagerContext.getEntityType(),
          permissions: this.workflowManagerContext.getPermissions()?.node ?? [],
          culture: this.culture,
        },
      })
    );

    await this.workflowManagerContext.refreshScaffold();
    this._buttonState = undefined;
  }

  async #onSelectionChange(e: CustomEvent) {
    const target = e.target as WorkflowApprovalGroupInputElement;
    this.workflowManagerContext?.setNodePermissions(
      target.selectedPermissions ?? []
    );
  }

  #onRemoveAll() {
    this.workflowManagerContext?.setNodePermissions([]);
    this.#save();
  }

  get cssClass() {
    return this.activeType === PermissionType.NEW ||
      this.activeType === PermissionType.NODE
      ? "active"
      : "";
  }

  get headline() {
    return this.localize.term(
      "workflow_approvalFlow",
      this.localize.term(
        `workflow_entityType_${
          this.workflowManagerContext?.getEntityType() ?? ""
        }`
      )
    );
  }

  render() {
    return html`<uui-box class=${this.cssClass} .headline=${this.headline}>
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
                      .name=${permission.icon ?? WORKFLOW_APPROVALGROUP_ICON}
                    ></umb-icon>
                  </workflow-ref-group-permission>`
              )}
            </uui-ref-list>
          </div>
        `
      )}
      <workflow-approval-group-input
        .config=${{
          emptyLabel: this.localize.term(
            "workflow_noDocumentFlow",
            this.localize
              .term(`workflow_entityType_${this.entityType}`)
              .toLowerCase()
          ),
          edit: true,
          multiple: true,
          document: this.workflowManagerContext!.getEntityId(),
          remove: true,
          defaultThreshold: this.defaultApprovalThreshold,
          configureThreshold: this.configureApprovalThreshold,
          additionalData: {
            variant: this.culture,
          },
        }}
        @change=${this.#onSelectionChange}
        .value=${this.permissions?.node.map((x) => x.groupUnique).join(",") ??
        ""}
        ?readonly=${this._readonly}
      >
      </workflow-approval-group-input>

      <div id="action-buttons">
        <uui-button
          color="danger"
          look="primary"
          @click=${this.#onRemoveAll}
          ?disabled=${this._readonly}
          label=${this.localize.term("workflow_removeAll")}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          @click=${this.#save}
          .state=${this._buttonState}
          label=${this.localize.term("buttons_save")}
          ?disabled=${this._readonly}
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
