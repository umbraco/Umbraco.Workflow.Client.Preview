import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbRoute } from "@umbraco-cms/backoffice/router";
import { UmbWorkspaceIsNewRedirectController } from "@umbraco-cms/backoffice/workspace";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowApprovalGroupWorkspaceContext } from "./approval-group-workspace.context.js";

const elementName = "workflow-approval-group-workspace";

@customElement(elementName)
export class ApprovalGroupWorkspaceElement extends UmbElementMixin(LitElement) {
  #workspaceContext = new WorkflowApprovalGroupWorkspaceContext(this);
  #editorElement?: HTMLElement;

  #getComponentElement = async () => {
    if (this.#editorElement) {
      return this.#editorElement;
    }

    this.#editorElement = new (
      await import("./approval-group-workspace-editor.element.js")
    ).default();

    return this.#editorElement;
  };

  @state()
  _routes: UmbRoute[] = [
    {
      path: "edit/:key",
      component: this.#getComponentElement,
      setup: (_component, info) => {
        this.#workspaceContext.load(info.match.params.key);
      },
    },
    {
      path: "create",
      component: this.#getComponentElement,
      setup: async () => {
        this.#workspaceContext.create();
        new UmbWorkspaceIsNewRedirectController(
          this,
          this.#workspaceContext,
          this.shadowRoot!.querySelector("umb-router-slot")!
        );
      },
    },
  ];

  render() {
    return html`<umb-router-slot .routes=${this._routes}></umb-router-slot>`;
  }
}

export default ApprovalGroupWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupWorkspaceElement;
  }
}
