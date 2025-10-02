import type { UmbTableItem } from "@umbraco-cms/backoffice/components";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbLanguageDetailModel } from "@umbraco-cms/backoffice/language";
import { ADVANCED_SEARCH_CONTEXT } from "../../advanced-search-context.token.js";
import { WorkflowTableBaseElement, type WorkflowTable } from "@umbraco-workflow/core";
import type {
  AdvancedSearchResponseItemModel,
  AdvancedSearchResponseModel,
  ContentTypePropertyModel,
} from "@umbraco-workflow/generated"
;
import "./advanced-search-results-table-name-column-layout.element.js";

const elementName = "workflow-advanced-search-results-table";

@customElement(elementName)
export class AdvancedSearchResultsTableElement
  extends WorkflowTableBaseElement
  implements WorkflowTable
{
  @state()
  private _languages?: Array<UmbLanguageDetailModel>;

  @state()
  private _contentTypes?: Array<ContentTypePropertyModel>;

  connectedCallback() {
    super.connectedCallback();

    this.consumeContext(ADVANCED_SEARCH_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this._languages = languages;
      });

      this.observe(context.contentTypes, (contentTypes) => {
        this._contentTypes = contentTypes;
      });
    });
  }

  #getCultureName(culture: string) {
    const c = culture.toLowerCase();
    return this._languages?.find((x) => x.unique.toLowerCase() === c)?.name;
  }

  #getContentTypeName(alias: string | null | undefined) {
    return this._contentTypes?.find((x) => x.alias === alias)?.name ?? "-";
  }

  buildTable() {
    this.tableColumns = [
      {
        name: this.localize.term("general_name"),
        alias: "name",
        elementName:
          "workflow-advanced-search-results-table-name-column-layout",
      },
      {
        name: this.localize.term("content_documentType"),
        alias: "documentType",
      },
      {
        name: this.localize.term("content_published"),
        alias: "published",
      },
      {
        name: this.localize.term("redirectUrls_culture"),
        alias: "culture",
      },
      {
        name: this.localize.term("workflowSearch_score"),
        alias: "score",
      },
    ];
  }

  map(result: AdvancedSearchResponseModel): Array<UmbTableItem> {
    if (result.totalItems === 0 || !result.results) {
      return [];
    }

    return (result?.results ?? []).map(
      (r: AdvancedSearchResponseItemModel) => ({
        id: r.key!,
        icon: r.icon ?? "document",
        data: [
          {
            columnAlias: "name",
            value: r,
          },
          {
            columnAlias: "documentType",
            value: this.#getContentTypeName(r.documentTypeAlias),
          },
          {
            columnAlias: "published",
            value: html`<uui-icon
              .name=${r.published ? "check" : "remove"}
            ></uui-icon>`,
          },
          {
            columnAlias: "culture",
            value: r.culture?.map(
              (c) => html`<uui-tag>${this.#getCultureName(c)}</uui-tag>`
            ),
          },
          {
            columnAlias: "score",
            value: r.score,
          },
        ],
      })
    );
  }
}

export default AdvancedSearchResultsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AdvancedSearchResultsTableElement;
  }
}
