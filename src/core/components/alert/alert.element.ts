import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-alert";

@customElement(elementName)
export class WorkflowAlertElement extends UmbElementMixin(LitElement) {
  @property()
  text?: string;

  @property()
  key?: string;

  @property({ type: Array })
  tokens?: Array<string | undefined>;

  @property()
  icon = "alert";

  #localize() {
    if (this.tokens?.length) {
      return html`${this.localize.term(this.key!, ...this.tokens)}`;
    }
    return html`${this.localize.term(this.key!)}`;
  }

  render() {
    return html`<div id="alert">
      <uui-icon name=${this.icon}></uui-icon>
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
      }

      :host(:first-child) {
        margin-top: 0;
      }

      #alert {
        background: var(--uui-color-current);
        color: var(--uui-color-current-contrast);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-radius: var(--uui-border-radius);
        padding: var(--uui-size-2);
        line-height: 1.4;
      }

      #alert.inline-block {
        display: inline-block;
        width: 100%;
      }

      #alert.alert-centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
