import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_ADVANCEDSEARCH_CONTEXT } from "../../advanced-search-context.token.js";
import {
  AdvancedSearchTypeModel,
  type SelectableContentTypePropertyDetailModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-advanced-search-search-type";

@customElement(elementName)
export class WorkflowAdvancedSearchSearchTypeElement extends UmbLitElement {
  #advancedSearchContext?: typeof WORKFLOW_ADVANCEDSEARCH_CONTEXT.TYPE;

  @state()
  private _selectedContentTypes: Array<SelectableContentTypePropertyDetailModel> =
    [];

  @state()
  value: {
    fuzzy: boolean;
    searchType: AdvancedSearchTypeModel;
  } = {
    fuzzy: false,
    searchType: "All",
  };

  constructor() {
    super();

    this.consumeContext(WORKFLOW_ADVANCEDSEARCH_CONTEXT, (context) => {
      if (!context) return;
      this.#advancedSearchContext = context;

      this.observe(
        this.#advancedSearchContext.selectedContentTypes,
        (selectedContentTypes) => {
          this._selectedContentTypes = selectedContentTypes;
        }
      );
    });
  }

  #onSearchTypeChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement)
      .value as AdvancedSearchTypeModel;

    this.#advancedSearchContext?.setSearchType(value);
    this.value.searchType = value;
  }

  #onFuzzyChange() {
    this.value!.fuzzy = !this.value?.fuzzy;
    this.#advancedSearchContext?.setFuzzy(this.value.fuzzy);
  }

  render() {
    if (!this._selectedContentTypes.length) return;

    return html`<uui-box
      .headline=${this.localize.term("workflow_search_selectSearchType")}
    >
      <div slot="header-actions">
        <div class="flex align-center" style="gap:var(--uui-size-3)">
          <uui-toggle
            .checked=${this.value.fuzzy}
            label-position="left"
            @change=${this.#onFuzzyChange}
            >${this.localize.term("workflow_search_fuzzy")}
          </uui-toggle>
          <workflow-tooltip
            .key=${"workflow_search_fuzzyDescription"}
          ></workflow-tooltip>
        </div>
      </div>
      <uui-radio-group
        class="flex"
        style="gap: var(--uui-size-5)"
        @change=${this.#onSearchTypeChange}
        name="searchType_radio"
      >
        <uui-radio
          value=${"All"}
          label=${this.localize.term("workflow_search_allProperties")}
        >
        </uui-radio>
        <uui-radio
          value=${"Some"}
          label=${this.localize.term("workflow_search_someProperties")}
        >
        </uui-radio>
        <uui-radio
          value=${"Single"}
          label=${this.localize.term("workflow_search_singleProperty")}
        >
        </uui-radio>
        <uui-radio
          value=${"Datatype"}
          label=${this.localize.term("workflow_search_datatype")}
        >
        </uui-radio>
        <uui-radio
          value=${"PropertyEditor"}
          label=${this.localize.term("workflow_search_propertyEditor")}
        >
        </uui-radio>
      </uui-radio-group>
    </uui-box>`;
  }

  static styles = css`
    .flex {
      display: flex;
    }

    .align-center {
      align-items: center;
    }
  `;
}

export default WorkflowAdvancedSearchSearchTypeElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchSearchTypeElement;
  }
}
