import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbRoute } from "@umbraco-cms/backoffice/router";
import { WorkflowContentReviewsWorkspaceContext } from "./content-reviews-workspace.context.js";

const elementName = "workflow-content-reviews-root-workspace";

@customElement(elementName)
export class WorkflowContentReviewsRootWorkspaceElement extends UmbElementMixin(
  LitElement
) {
  #workspaceContext = new WorkflowContentReviewsWorkspaceContext(this);
  #editorElement?: HTMLElement;

  #getComponentElement = async () => {
    if (this.#editorElement) {
      return this.#editorElement;
    }

    this.#editorElement = new (
      await import("./content-reviews-editor.element.js")
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

export default WorkflowContentReviewsRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsRootWorkspaceElement;
  }
}
