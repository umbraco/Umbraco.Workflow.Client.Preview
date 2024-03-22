import type { UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import {
  css,
  html,
  customElement,
  state,
  LitElement,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbModalManagerContext } from "@umbraco-cms/backoffice/modal";
import {
  UMB_ICON_PICKER_MODAL,
  UMB_MODAL_MANAGER_CONTEXT,
} from "@umbraco-cms/backoffice/modal";
import { generateAlias } from "@umbraco-cms/backoffice/utils";
import type { WorkflowApprovalGroupDetailModel } from "../../types.js";
import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT } from "./approval-group-workspace.context-token.js";

const elementName = "workflow-approval-group-workspace-editor";

@customElement(elementName)
export class ApprovalGroupWorkspaceEditorElement extends UmbElementMixin(
  LitElement
) {
  @state()
  private _group?: WorkflowApprovalGroupDetailModel;

  @state()
  private _isNew?: boolean;

  @state()
  private _aliasLocked = true;

  @state()
  private _iconColorAlias?: string;

  #workspaceContext?: typeof WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT.TYPE;
  #modalContext?: UmbModalManagerContext;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT,
      (context) => {
        this.#workspaceContext = context;
        this.#observeGroup();
      }
    );

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalContext = instance;
    });
  }

  #observeGroup() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.data, (data) => {
      this._group = data;
    });

    this.observe(this.#workspaceContext.isNew, (isNew) => {
      this._isNew = isNew;
    });
  }

  // TODO. find a way where we don't have to do this for all workspaces.
  #onNameChange(event: UUIInputEvent) {
    if (event instanceof UUIInputEvent) {
      const target = event.composedPath()[0] as UUIInputElement;

      if (typeof target?.value !== "string") return;

      const oldName = this._group!.name;
      const oldAlias = this._group!.alias;
      const newName = event.target.value.toString();

      if (this._aliasLocked) {
        const expectedOldAlias = generateAlias(oldName ?? "");
        // Only update the alias if the alias matches a generated alias of the old name (otherwise the alias is considered one written by the user.)
        if (expectedOldAlias === oldAlias) {
          this.#workspaceContext?.setAlias(generateAlias(newName));
        }
      }

      this.#workspaceContext?.setName(target.value);
    }
  }

  // TODO. find a way where we don't have to do this for all workspaces.
  #onAliasChange(event: UUIInputEvent) {
    if (event instanceof UUIInputEvent) {
      const target = event.composedPath()[0] as UUIInputElement;

      if (typeof target?.value === "string") {
        this.#workspaceContext?.setAlias(target.value);
      }
    }

    event.stopPropagation();
  }

  async #handleIconClick() {
    if (!this.#modalContext) return;

    const modalContext = this.#modalContext.open(this, UMB_ICON_PICKER_MODAL, {
      value: {
        icon: this._group!.icon ?? "users",
        color: this._iconColorAlias,
      },
    });

    const { icon } = await modalContext.onSubmit();

    if (icon) {
      this.#workspaceContext?.setIcon(icon);
      // TODO => save color
    }
  }

  #onToggleAliasLock() {
    this._aliasLocked = !this._aliasLocked;
  }

  render() {
    return html`<umb-workspace-editor
      alias="Workflow.Workspace.ApprovalGroup"
    >
      <div id="header" slot="header">
        <uui-button
          id="back-button"
          label="Navigate back"
          href="section/workflow/workspace/approval-group-root"
          compact
        >
          <uui-icon name="icon-arrow-left"></uui-icon>
        </uui-button>
        <uui-button
          id="icon"
          @click=${this.#handleIconClick}
          label="icon"
          compact
        >
          <uui-icon
            name=${this._group?.icon ?? "icon-users"}
            style="color: ${this._iconColorAlias}"
          ></uui-icon>
        </uui-button>

        <uui-input
          id="name"
          .value=${this._group?.name}
          @input="${this.#onNameChange}"
          label="name"
        >
          <!-- TODO: should use UUI-LOCK-INPUT, but that does not fire an event when its locked/unlocked -->
          <uui-input
            name="alias"
            slot="append"
            label="alias"
            @input=${this.#onAliasChange}
            .value=${this._group?.alias}
            placeholder="Enter alias..."
            ?disabled=${this._aliasLocked}
          >
            <!-- TODO: validation for bad characters -->
            <div
              @click=${this.#onToggleAliasLock}
              @keydown=${() => ""}
              id="alias-lock"
              slot="prepend"
            >
              <uui-icon
                name=${this._aliasLocked ? "lock" : "unlocked"}
              ></uui-icon>
            </div>
          </uui-input>
        </uui-input>
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
      }

      #name {
        width: 100%;
        flex: 1 1 auto;
        align-items: center;
      }

      #back-button {
        margin-right: var(--uui-size-space-2);
        margin-left: calc(var(--uui-size-space-4) * -1);
      }

      #alias-lock {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      #alias-lock uui-icon {
        margin-bottom: 2px;
      }

      #icon {
        font-size: calc(var(--uui-size-layout-3) / 2);
        margin-right: var(--uui-size-space-2);
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
