import {
  css,
  customElement,
  html,
  nothing,
  property,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

const elementName = "alternate-version-table-inset-column-layout";

@customElement(elementName)
export class AlternateVersionTableInsetColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: Array<string>;

  render() {
    if (!this.value) return nothing;

    return html`${repeat(
      new Set(this.value),
      (setName) => setName,
      (setName) => html`<uui-tag>${setName}</uui-tag>`
    )}`;
  }

  static styles = css`
    :host {
      display: flex;
      column-gap: var(--uui-size-1);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AlternateVersionTableInsetColumnLayoutElement;
  }
}
