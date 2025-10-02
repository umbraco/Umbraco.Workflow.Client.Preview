import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WorkflowAdvancedSearchContext } from "./advanced-search.context.js";
import type { TableQueryModel } from "@umbraco-workflow/core";
import { AdvancedSearchService } from "@umbraco-workflow/generated";
import { ADVANCED_SEARCH_CONTEXT } from "./advanced-search-context.token.js";

const elementName = "workflow-advanced-search-dashboard";

@customElement(elementName)
export class AdvancedSearchDashboardElement extends UmbLitElement {
  #advancedSearchContext?: typeof ADVANCED_SEARCH_CONTEXT.TYPE;

  @state()
  private _hasSearched = false;

  @state()
  private _searchModel: TableQueryModel = {
    handler: AdvancedSearchService.postAdvancedSearchSearch,
  };

  constructor() {
    super();

    this.#advancedSearchContext = new WorkflowAdvancedSearchContext(this);
    this.provideContext(ADVANCED_SEARCH_CONTEXT, this.#advancedSearchContext);

    this.observe(this.#advancedSearchContext.searchModel, (searchModel) => {
      if (!searchModel) return;
      this._searchModel = { ...this._searchModel, meta: searchModel };
    });
  }

  #clear() {
    this.#advancedSearchContext?.clear();
    this._hasSearched = false;
  }

  async #search() {
    this.#advancedSearchContext?.search();
    this._hasSearched = true;
  }

  render() {
    return html`
      <workflow-advanced-search-content-types></workflow-advanced-search-content-types>
      <workflow-advanced-search-search-type></workflow-advanced-search-search-type>
      <workflow-advanced-search-field-type></workflow-advanced-search-field-type>

      <div id="searchButtons">
        <uui-button
          @click=${this.#clear}
          label=${this.localize.term("general_clear")}
        ></uui-button>
        <uui-button
          @click=${this.#search}
          label=${this.localize.term("general_search")}
          look="primary"
          color="positive"
        ></uui-button>
      </div>

      ${when(
        this._hasSearched,
        () => html` <uui-box
          id="searchResults"
          .headline=${this.localize.term("general_searchResults")}
        >
          <workflow-advanced-search-results-table
            .model=${this._searchModel}
          ></workflow-advanced-search-results-table>
        </uui-box>`
      )}
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      :host > * + * {
        display: block;
        margin-top: var(--uui-size-layout-1);
      }

      #searchButtons {
        display: flex;
        justify-content: center;
      }

      #searchResults {
        position: relative;
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default AdvancedSearchDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AdvancedSearchDashboardElement;
  }
}
