import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { umbFocus, UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type {
  UUIInputElement,
  UUITextareaElement,
} from "@umbraco-cms/backoffice/external/uui";
import { type UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_RELEASESET_WORKSPACE_ALIAS } from "../constants.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "./release-set-workspace.context-token.js";
import { WorkflowReleaseSetVersionsEditorContext } from "../components/release-set-versions/release-set-versions-editor.context.js";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UMB_ICON_PICKER_MODAL } from "@umbraco-cms/backoffice/icon";

const elementName = "workflow-releaseset-workspace-editor";

@customElement(elementName)
export class WorkflowReleaseSetWorkspaceEditorElement
  extends UmbLitElement
  implements UmbWorkspaceViewElement
{
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _name = "";

  @state()
  private _icon?: string;

  @state()
  private _description?: string | null;

  constructor() {
    super();

    new WorkflowReleaseSetVersionsEditorContext(this);

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
      this.#observeEntity();
    });
  }

  #observeEntity() {
    if (!this.#workspaceContext) return;

    this.observe(
      this.#workspaceContext.name,
      (name) => (this._name = name ?? "")
    );

    this.observe(
      this.#workspaceContext.description,
      (description) => (this._description = description)
    );
    this.observe(this.#workspaceContext.icon, (icon) => (this._icon = icon));
  }

  #onNameChange(event: InputEvent & { target: UUIInputElement }) {
    const name = event.target.value?.toString();
    if (!name) return;

    this.#workspaceContext?.update({ name });
  }

  async #onIconClick() {
    const [icon, color] =
      this.#workspaceContext
        ?.getData()
        ?.icon?.replace("color-", "")
        ?.split(" ") ?? [];

    const saved = await umbOpenModal(this, UMB_ICON_PICKER_MODAL, {
      value: {
        icon,
        color,
      },
    }).catch(() => {});

    if (!saved?.icon) return;

    this.#workspaceContext?.update({
      icon: saved.color ? `${saved.icon} color-${saved.color}` : saved.icon,
    });
  }

  #onDescriptionChange(event: InputEvent & { target: UUITextareaElement }) {
    this.#workspaceContext?.update({
      description: event.target.value.toString() ?? "",
    });
  }

  render() {
    return html`<umb-workspace-editor
      main-no-padding
      alias=${WORKFLOW_RELEASESET_WORKSPACE_ALIAS}
    >
      <div id="header" slot="header">
        <uui-button id="icon" @click=${this.#onIconClick} label="icon" compact
          ><umb-icon .name=${this._icon}></umb-icon>
        </uui-button>
        <div id="editors">
          <uui-input
            id="name"
            label="name"
            .value=${this._name}
            @change=${this.#onNameChange}
            ${umbFocus()}
          >
          </uui-input>
          <uui-input
            id="description"
            .label=${this.localize.term("placeholders_enterDescription")}
            .value=${this._description ?? ""}
            .placeholder=${this.localize.term("placeholders_enterDescription")}
            @input=${this.#onDescriptionChange}
          ></uui-input>
        </div>
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

      #editors {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        gap: 1px;
      }

      #description {
        width: 100%;
        --uui-input-height: var(--uui-size-8);
        --uui-input-border-color: transparent;
      }

      #description:hover {
        --uui-input-border-color: var(--uui-color-border);
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

export default WorkflowReleaseSetWorkspaceEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetWorkspaceEditorElement;
  }
}
