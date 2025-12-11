import {
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { type AlternateVersionTableNameColumnData } from "@umbraco-workflow/alternate-versions";

const elementName = "alternate-version-table-name-column-layout";

@customElement(elementName)
export class AlternateVersionTableNameColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: AlternateVersionTableNameColumnData;

  render() {
    if (!this.value?.modalPath) return;

    return html`<uui-button
      href=${this.value.modalPath}
      .label=${this.value.name}
      compact
    ></uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AlternateVersionTableNameColumnLayoutElement;
  }
}
