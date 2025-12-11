import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbLanguageDetailModel } from "@umbraco-cms/backoffice/language";
import { WORKFLOW_ADVANCEDSEARCH_CONTEXT } from "../../advanced-search-context.token.js";
import {
  type AdvancedSearchResponseItemModel,
  type ContentTypePropertyModel,
} from "@umbraco-workflow/generated";
import "./advanced-search-results-table-name-column-layout.element.js";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

const elementName = "workflow-advanced-search-results-table";

@customElement(elementName)
export class AdvancedSearchResultsTableElement extends UmbLitElement {
  @state()
  private _languages?: Array<UmbLanguageDetailModel>;

  @state()
  private _contentTypes?: Array<ContentTypePropertyModel>;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: false,
  };

  @state()
  private _tableColumns: Array<UmbTableColumn> = [
    {
      name: this.localize.term("general_name"),
      alias: "name",
      elementName: "workflow-advanced-search-results-table-name-column-layout",
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
      name: this.localize.term("workflow_search_score"),
      alias: "score",
    },
  ];

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_ADVANCEDSEARCH_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this._languages = languages;
      });

      this.observe(context.contentTypes, (contentTypes) => {
        this._contentTypes = contentTypes;
      });

      this.observe(context.searchResults, (searchResults) => {
        this.buildTableItems(searchResults?.results ?? []);
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

  buildTableItems(items: AdvancedSearchResponseItemModel[]) {
    this._tableItems = items.map((r: AdvancedSearchResponseItemModel) => ({
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
    }));
  }

  override render() {
    return html`
      <umb-table
        .config=${this._tableConfig}
        .columns=${this._tableColumns}
        .items=${this._tableItems}
      ></umb-table>
    `;
  }
}

export default AdvancedSearchResultsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AdvancedSearchResultsTableElement;
  }
}
