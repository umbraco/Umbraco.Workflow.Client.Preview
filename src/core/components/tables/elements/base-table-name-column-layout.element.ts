import {
  UMB_DOCUMENT_ENTITY_TYPE,
  UMB_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN,
} from "@umbraco-cms/backoffice/document";
import {
  css,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_WORKSPACE_PATH_PATTERN } from "@umbraco-cms/backoffice/workspace";
import {
  type BaseTableNameColumnData,
  type TableColumnLayout,
} from "@umbraco-workflow/core";

const elementName = "base-table-name-column-layout";

@customElement(elementName)
export class BaseTableNameColumnLayoutElement
  extends UmbLitElement
  implements TableColumnLayout<BaseTableNameColumnData>
{
  @property({ attribute: false })
  value!: BaseTableNameColumnData;

  #workspacePath = UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
    sectionName: "content",
    entityType: UMB_DOCUMENT_ENTITY_TYPE,
  });

  #editPath?: string;

  async connectedCallback() {
    super.connectedCallback();

    if (!this.value.unique) return;
    this.#editPath = UMB_EDIT_DOCUMENT_WORKSPACE_PATH_PATTERN.generateLocal({
      unique: this.value.unique,
    });
  }

  #displayName() {
    return this.value.culture !== "*"
      ? `${this.value?.name} (${this.value.culture})`
      : this.value?.name;
  }

  #variantCode() {
    return this.value.culture === "*" ? "invariant" : this.value.culture;
  }

  // TODO => segment routing
  render() {
    if (!this.value) return nothing;

    return html`<a
      href="${this.#workspacePath}/${this.#editPath}/${this.#variantCode()}"
      >${this.#displayName()}</a
    >`;
  }

  static styles = css`
    a {
      font-weight: bold;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: BaseTableNameColumnLayoutElement;
  }
}
