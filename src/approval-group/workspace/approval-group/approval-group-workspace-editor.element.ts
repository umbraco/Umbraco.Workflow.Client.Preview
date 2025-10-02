import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement, umbFocus } from "@umbraco-cms/backoffice/lit-element";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import type { UmbInputWithAliasElement } from "@umbraco-cms/backoffice/components";
import { UMB_ICON_PICKER_MODAL } from "@umbraco-cms/backoffice/icon";
import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT } from "./approval-group-workspace.context-token.js";
import type { ApprovalGroupDetailResponseModelReadable } from "@umbraco-workflow/generated";

const elementName = "workflow-approval-group-workspace-editor";

@customElement(elementName)
export class ApprovalGroupWorkspaceEditorElement extends UmbLitElement {
  @state()
  private _group?: ApprovalGroupDetailResponseModelReadable;

  @state()
  private _isNew?: boolean;

  @state()
  private _icon?: string;

  #workspaceContext?: typeof WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT,
      (context) => {
        this.#workspaceContext = context;
        this.#observeGroup();
      }
    );
  }

  #observeGroup() {
    if (!this.#workspaceContext) return;

    this.observe(
      this.#workspaceContext.data,
      (data) => {
        this._group = data;
      },
      "_observeGroup"
    );

    this.observe(
      this.#workspaceContext.isNew,
      (isNew) => {
        this._isNew = isNew;
      },
      "_observeIsNew"
    );

    this.observe(
      this.#workspaceContext.icon,
      (icon) => (this._icon = icon ?? "icon-users"),
      "_observeIcon"
    );
  }

  async #handleIconClick() {
    const [icon, color] =
      this._group?.icon?.replace("color-", "")?.split(" ") ?? [];

    const saved = await umbOpenModal(this, UMB_ICON_PICKER_MODAL, {
      value: {
        icon,
        color,
      },
    }).catch(() => {});

    if (!saved?.icon) return;
    this.#workspaceContext?.setIcon(
      saved.color ? `${saved.icon} color-${saved.color}` : saved.icon
    );
  }

  #onNameAndAliasChange(
    event: InputEvent & { target: UmbInputWithAliasElement }
  ) {
    this.#workspaceContext?.setName(event.target.value ?? "");
    this.#workspaceContext?.setAlias(event.target.alias ?? "");
  }

  render() {
    if (!this._group) return;

    return html`<umb-workspace-editor alias="Workflow.Workspace.ApprovalGroup">
      <div id="header" slot="header">
        <uui-button
          id="back-button"
          label="Navigate back"
          href="section/workflow/workspace/approval-group-root"
          compact
        >
          <umb-icon name="icon-arrow-left"></umb-icon>
        </uui-button>
        <uui-button
          id="icon"
          @click=${this.#handleIconClick}
          label="icon"
          compact
          ><umb-icon .name=${this._icon}></umb-icon>
        </uui-button>

        <umb-input-with-alias
          id="name"
          label="name"
          .value=${this._group?.name}
          .alias=${this._group?.alias}
          ?auto-generate-alias=${this._isNew}
          @change=${this.#onNameAndAliasChange}
          ${umbFocus()}
        >
        </umb-input-with-alias>
      </div>
    </umb-workspace-editor>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      #header {
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        gap: var(--uui-size-space-2);
      }

      #name {
        width: 100%;
      }

      #back-button {
        margin-right: var(--uui-size-space-2);
        margin-left: calc(var(--uui-size-space-4) * -1);
      }

      #icon {
        font-size: var(--uui-size-8);
        height: 60px;
        width: 60px;
        --uui-button-border-color: transparent;
        --uui-button-border-color-hover: var(--uui-color-border);
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
