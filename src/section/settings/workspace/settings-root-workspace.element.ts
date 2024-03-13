import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbRoute } from "@umbraco-cms/backoffice/router";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { WorkflowSettingsWorkspaceContext } from "./settings-workspace.context.js";

const elementName = "workflow-settings-root-workspace";

@customElement(elementName)
export class WorkflowSettingsRootWorkspaceElement extends UmbElementMixin(
  LitElement
) {
  #workspaceContext = new WorkflowSettingsWorkspaceContext(this);
  #editorElement?: HTMLElement;

  #getComponentElement = async () => {
    if (this.#editorElement) {
      return this.#editorElement;
    }

    this.#editorElement = new (
      await import("./settings-editor.element.js")
    ).default();

    return this.#editorElement;
  };

  @state()
  _routes: UmbRoute[] = [
    {
      path: "",
      component: this.#getComponentElement,
      setup: () => {
        this.#workspaceContext.load();
      },
    },
  ];

  render() {
    return html`<umb-router-slot .routes=${this._routes}></umb-router-slot>`;
  }
}

export default WorkflowSettingsRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsRootWorkspaceElement;
  }
}
