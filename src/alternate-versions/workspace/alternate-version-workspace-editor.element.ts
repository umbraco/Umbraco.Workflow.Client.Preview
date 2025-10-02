import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { umbFocus, UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import { type UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS } from "../constants.js";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "./context/alternate-version-workspace.context-token.js";

const elementName = "workflow-alternateversion-workspace-editor";

@customElement(elementName)
export class WorkflowAlternateVersionWorkspaceEditorElement
  extends UmbLitElement
  implements UmbWorkspaceViewElement
{
  #workspaceContext?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _documentName?: string;

  @state()
  private _versionName?: string;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.#workspaceContext = context;
        this.#observeEntity();
      }
    );
  }

  #observeEntity() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.versionName, (versionName) => {
      if (!versionName) return;
      this._versionName = versionName;
    });

    this.observe(this.#workspaceContext.documentName, (documentName) => {
      if (!documentName) return;
      this._documentName = documentName;
    });
  }

  #onNameChange(event: InputEvent & { target: UUIInputElement }) {
    this.#workspaceContext?.setName(event.target.value?.toString() ?? "");
  }

  #onVersionNameChange(event: InputEvent & { target: UUIInputElement }) {
    this.#workspaceContext?.setVersionName(
      event.target.value?.toString() ?? ""
    );
  }

  render() {
    return html`<umb-workspace-editor
      main-no-padding
      alias=${WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS}
    >
      <div id="header" slot="header">
        <umb-property-layout .label=${this.localize.term("workflow_alternateVersions_versionName")}>
          <uui-input
            slot="editor"
            id="versionName"
            .value=${this._versionName ?? ""}
            @change=${this.#onVersionNameChange}
            ${umbFocus()}
          >
          </uui-input>
        </umb-property-layout>

        <umb-property-layout .label=${this.localize.term("workflow_alternateVersions_documentName")}>
          <uui-input
            slot="editor"
            id="documentName"
            .value=${this._documentName ?? ""}
            @change=${this.#onNameChange}
          >
          </uui-input>
        </umb-property-layout>
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
        height: 100%;
        display: flex;
        flex: 1 1 auto;
      }

      uui-input {
        width: 100%;
      }

      umb-property-layout {
        align-items: center;
        flex: 1;
        grid-template-columns: max-content minmax(0, 1fr);
      }

      umb-property-layout:first-child {
        padding: 0 var(--uui-size-8) 0 0;
      }

      umb-property-layout:last-child {
        padding: 0 0 0 var(--uui-size-8);
        border-left: 1px solid var(--uui-color-border);
      }
    `,
  ];
}

export default WorkflowAlternateVersionWorkspaceEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionWorkspaceEditorElement;
  }
}
