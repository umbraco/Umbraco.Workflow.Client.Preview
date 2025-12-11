import {
  html,
  customElement,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { umbFocus, UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_APPROVALGROUP_WORKSPACE_CONTEXT } from "./approval-group-workspace.context-token.js";
import { WORKFLOW_APPROVALGROUP_ROOT_WORKSPACE_PATH } from "../approval-group-root/paths.js";
import { UmbInputWithAliasElement } from "@umbraco-cms/backoffice/components";
import { UMB_ICON_PICKER_MODAL } from "@umbraco-cms/backoffice/icon";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";

const elementName = "workflow-approval-group-workspace-editor";

@customElement(elementName)
export class ApprovalGroupWorkspaceEditorElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_APPROVALGROUP_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _isNew?: boolean;

  @state()
  private _readonly = false;

  @state()
  private _icon?: string | null;

  @state()
  private _name?: string | null;

  @state()
  private _alias?: string | null;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_APPROVALGROUP_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
      this.#observeApprovalGroup();
    });
  }

  #observeApprovalGroup() {
    if (!this.#workspaceContext) return;

    this.observe(
      this.#workspaceContext.isNew,
      (isNew) => (this._isNew = isNew),
      Symbol()
    );

    this.observe(
      this.#workspaceContext.readOnlyGuard.permitted,
      (readonly) => (this._readonly = readonly),
      Symbol()
    );

    this.observe(
      this.#workspaceContext.icon,
      (icon) => (this._icon = icon),
      Symbol()
    );
    this.observe(
      this.#workspaceContext.name,
      (name) => (this._name = name),
      Symbol()
    );
    this.observe(
      this.#workspaceContext.alias,
      (alias) => (this._alias = alias),
      Symbol()
    );
  }

  async #onIconClick() {
    const [alias, color] = this._icon?.replace("color-", "")?.split(" ") ?? [];
    const result = await umbOpenModal(this, UMB_ICON_PICKER_MODAL, {
      value: {
        icon: alias,
        color: color,
      },
    }).catch(() => undefined);

    if (!result) return;

    if (result.icon && result.color) {
      this.#workspaceContext?.set({
        icon: `${result.icon} color-${result.color}`,
      });
    } else if (result.icon) {
      this.#workspaceContext?.set({ icon: result.icon });
    }
  }

  #onNameAndAliasChange(
    event: InputEvent & { target: UmbInputWithAliasElement }
  ) {
    this.#workspaceContext?.setName(event.target.value);
    this.#workspaceContext?.set({ alias: event.target.alias });
  }

  #renderHeader() {
    return html`
      <div id="header" slot="header">
        <uui-button
          id="icon"
          compact
          label="icon"
          look="outline"
          ?disabled=${this._readonly}
          @click=${this.#onIconClick}
        >
          <umb-icon name=${this._icon || ""}></umb-icon>
        </uui-button>

        <umb-input-with-alias
          id="name"
          label=${this.localize.term("placeholders_entername")}
          .value=${this._name}
          .alias=${this._alias ?? ""}
          ?readonly=${this._readonly}
          ?auto-generate-alias=${this._isNew}
          @change=${this.#onNameAndAliasChange}
          ${umbFocus()}
        >
        </umb-input-with-alias>
      </div>
    `;
  }

  render() {
    return html`<umb-entity-detail-workspace-editor
      .backPath=${WORKFLOW_APPROVALGROUP_ROOT_WORKSPACE_PATH}
    >
      ${this.#renderHeader()}
    </umb-entity-detail-workspace-editor>`;
  }

  static override styles = [
    css`
      :host {
        display: block;
        height: 100%;
      }

      #header {
        display: flex;
        flex: 1 1 auto;
        gap: var(--uui-size-space-2);
        align-items: center;
      }

      #icon {
        font-size: var(--uui-size-5);
        height: 30px;
        width: 30px;
      }

      #name {
        width: 100%;
        flex: 1 1 auto;
        align-items: center;
      }

      uui-input {
        width: 100%;
      }
    `,
  ];
}

export default ApprovalGroupWorkspaceEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupWorkspaceEditorElement;
  }
}
