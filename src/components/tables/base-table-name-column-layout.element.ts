import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { LanguageModel } from "@umbraco-workflow/generated";

export type BaseTableNameColumnData = {
  languages: Array<LanguageModel>;
  nodeName: string;
  nodeKey: string;
  variantCode?: string;
  defaultCulture?: string;
};

const elementName = "base-table-name-column-layout";

@customElement(elementName)
export class BaseTableNameColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: BaseTableNameColumnData;

  #displayName() {
    return this.value.languages?.length > 1
      ? `${this.value.nodeName} (${
          this.value.languages.find(
            (x) => x.isoCode === this.value.defaultCulture
          )?.name
        })`
      : this.value.nodeName;
  }

  #variantCode() {
    return this.value.variantCode === "*"
      ? this.value.defaultCulture
      : this.value.variantCode;
  }

  render() {
    if (!this.value) return nothing;

    return html`<a
      href="section/content/workspace/document/edit/${this.value
        .nodeKey}/${this.#variantCode()}/view/content"
      >${this.#displayName()}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: BaseTableNameColumnLayoutElement;
  }
}
