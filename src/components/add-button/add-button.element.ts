import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-add-button";

@customElement(elementName)
export class AddButtonElement extends UmbElementMixin(LitElement) {
  @property()
  set labelKey(value: string) {
    this.label = this.localize.term(value);
  }

  @state()
  label = this.localize.term("general_add");

  render() {
    return html`<uui-button look="placeholder" .label=${this.label}>
      ${this.label}
    </uui-button>`;
  }

  static styles = [
    css`
      uui-button {
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AddButtonElement;
  }
}
