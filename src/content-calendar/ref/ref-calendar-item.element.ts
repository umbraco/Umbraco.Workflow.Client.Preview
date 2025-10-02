import { UUIRefNodeElement } from "@umbraco-cms/backoffice/external/uui";
import { html, customElement, css } from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-ref-calendar-item";

@customElement(elementName)
export class WorkflowRefCalendarItemElement extends UUIRefNodeElement {
  selectable = false;

  override render() {
    return html`
      <span id="content">
        <span id="icon">
          <slot name="icon"></slot>
        </span>
        <div id="info">
          <div id="name"><slot name="name"></div>
          <small id="detail"><slot name="detail"></slot></small>
          <div id="versions"><slot name="versions"></slot></div>
        </div>
      </span>
      <div id="select-border"></div>
    `;
  }

  static styles = [
    ...UUIRefNodeElement.styles,
    css`
      :host {
        padding: var(--uui-size-4) 0;
      }

      #content {
        padding-left: 0;
        padding-right: 0;
      }

      button {
        font-weight: 700;
      }

      button:hover {
        cursor: pointer;
        text-decoration: underline;
        color: var(--uui-color-interactive-emphasis);
      }

      #versions {
        margin-top: var(--uui-size-2);
        font-size: var(--uui-type-small-size);
      }

      #versions div {
        margin-top: var(--uui-size-2);
      }

      #versions strong {
        display: block;
      }

      #icon {
        align-self: flex-start;
      }
    `,
  ];
}

export default WorkflowRefCalendarItemElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowRefCalendarItemElement;
  }
}
