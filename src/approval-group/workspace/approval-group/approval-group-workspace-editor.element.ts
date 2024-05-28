import {
  css,
  html,
  customElement,
  state,
  LitElement,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  UMB_ICON_PICKER_MODAL,
  UMB_MODAL_MANAGER_CONTEXT,
} from "@umbraco-cms/backoffice/modal";
import { umbFocus } from "@umbraco-cms/backoffice/lit-element";
import type { UmbInputWithAliasElement } from "@umbraco-cms/backoffice/components";
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

    this.observe(this.#workspaceContext.data, (data) => {
      this._group = data;
    });

    this.observe(this.#workspaceContext.isNew, (isNew) => {
      this._isNew = isNew;
    });
  }

  async #handleIconClick() {
    const [alias, color] =
      this._group?.icon?.replace("color-", "")?.split(" ") ?? [];
    const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalContext = modalManager.open(this, UMB_ICON_PICKER_MODAL, {
      value: {
        icon: alias,
        color: color,
      },
    });

    modalContext?.onSubmit().then((saved) => {
      if (saved.icon && saved.color) {
        this.#workspaceContext?.setIcon(`${saved.icon} color-${saved.color}`);
      } else if (saved.icon) {
        this.#workspaceContext?.setIcon(saved.icon);
      }
    });
  }

  #onNameAndAliasChange(
    event: InputEvent & { target: UmbInputWithAliasElement }
  ) {
    this.#workspaceContext?.setName(event.target.value ?? "");
    this.#workspaceContext?.setAlias(event.target.alias ?? "");
  }

  render() {
    return html`<umb-workspace-editor alias="Workflow.Workspace.ApprovalGroup">
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
          <uui-icon name=${this._group?.icon ?? "icon-users"}></uui-icon>
        </uui-button>

        <umb-input-with-alias
          id="name"
          label="name"
          .value=${this._group?.name}
          .alias=${this._group?.alias}
          ?auto-generate-alias=${this._isNew}
          @change="${this.#onNameAndAliasChange}"
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
      }

      #name {
        width: 100%;
      }

      #back-button {
        margin-right: var(--uui-size-space-2);
        margin-left: calc(var(--uui-size-space-4) * -1);
      }

			#icon {
				font-size: calc(var(--uui-size-layout-3) / 2);
				margin-right: var(--uui-size-space-2);
				margin-left: calc(var(--uui-size-space-4) * -1);
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
