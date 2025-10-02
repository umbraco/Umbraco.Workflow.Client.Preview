import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { AlternateVersionTableNameColumnData } from "@umbraco-workflow/alternate-versions";
import type { TableColumnLayout } from "@umbraco-workflow/core";

const elementName = "alternate-version-table-name-column-layout";

@customElement(elementName)
export class AlternateVersionTableNameColumnLayoutElement
  extends UmbLitElement
  implements TableColumnLayout<AlternateVersionTableNameColumnData>
{
  @property({ attribute: false })
  value!: AlternateVersionTableNameColumnData;

  render() {
    if (!this.value) return nothing;

    return html`<uui-button
      href=${`${this.value.modalPath}edit/${this.value.unique}`}
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
