import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-alert";

@customElement(elementName)
export class WorkflowAlertElement extends UmbLitElement {
  @property()
  text?: string;

  @property()
  key?: string;

  @property({ type: Array })
  tokens?: Array<string | undefined>;

  @property()
  icon = "alert";

  @property({ attribute: "no-icon", type: Boolean })
  noIcon = false;

  /* Light alert has no icon, no border, and no background color */
  @property({ type: Boolean, reflect: true })
  light = false;

  #localize() {
    if (this.tokens?.length) {
      return html`${this.localize.term(this.key!, ...this.tokens)}`;
    }
    return html`${this.localize.term(this.key!)}`;
  }

  render() {
    return html`<div id="alert">
      ${when(
        this.noIcon === false && this.light === false,
        () => html` <uui-icon name=${this.icon}></uui-icon>`
      )}
      ${when(
        this.key,
        () => this.#localize(),
        () => html`<slot>${this.text}</slot>`
      )}
      <slot name="content"></slot>
    </div>`;
  }

  static styles = [
    css`
      :host {
        margin-top: var(--uui-size-4);
        --background-color: var(--uui-color-current);
      }

      :host(:first-child) {
        margin-top: 0;
      }

      :host([light]) {
        --background-color: transparent;

        #alert {
          justify-content: center;
        }
      }

      #alert {
        background: var(--background-color);
        color: var(--uui-color-current-contrast);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-radius: var(--uui-border-radius);
        padding: var(--uui-size-3);
        line-height: 1.4;
      }

      p {
        margin: 0;
      }

      uui-icon {
        font-size: var(--uui-size-7);
        margin-right: var(--uui-size-4);
      }

      del {
        color: red;
      }

      ins {
        color: green;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlertElement;
  }
}
