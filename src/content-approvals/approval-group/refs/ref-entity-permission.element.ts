import { UUIRefNodeElement } from "@umbraco-cms/backoffice/external/uui";
import {
  html,
  customElement,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { WorkflowRefPermissionElementStyles } from "./ref-permission-element.styles.js";

const elementName = "workflow-ref-entity-permission";

@customElement(elementName)
export class WorkflowRefEntityPermissionElement extends UmbElementMixin(
  UUIRefNodeElement
) {
  selectable = false;

  @property({ type: Boolean })
  disabled = false;

  render() {
    return html`
      <span id="icon"><slot name="icon"></slot></span>
      <div id="info">
        <div id="name">${this.name}</div>
        <small id="detail">
          <slot name="detail"></slot>
        </small>
      </div>
      <slot name="actions" id="actions-container"></slot>
    `;
  }

  static styles = [
    ...UUIRefNodeElement.styles,
    ...WorkflowRefPermissionElementStyles,
  ];
}

export default WorkflowRefEntityPermissionElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowRefEntityPermissionElement;
  }
}
