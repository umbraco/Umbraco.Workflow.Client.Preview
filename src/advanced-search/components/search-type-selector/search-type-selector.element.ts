import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { ADVANCED_SEARCH_CONTEXT } from "../../advanced-search-context.token.js";
import {
  AdvancedSearchTypeModel,
  type SelectableContentTypePropertyDetailModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-advanced-search-search-type";

@customElement(elementName)
export class WorkflowAdvancedSearchSearchTypeElement extends UmbLitElement {
  #advancedSearchContext?: typeof ADVANCED_SEARCH_CONTEXT.TYPE;

  @state()
  private _selectedContentTypes: Array<SelectableContentTypePropertyDetailModel> =
    [];

  @state()
  value: {
    fuzzy: boolean;
    searchType: AdvancedSearchTypeModel;
  } = {
    fuzzy: false,
    searchType: AdvancedSearchTypeModel.ALL,
  };

  constructor() {
    super();

    this.consumeContext(ADVANCED_SEARCH_CONTEXT, (context) => {
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
      .headline=${this.localize.term("workflowSearch_selectSearchType")}
    >
      <div slot="header-actions">
        <div class="flex align-center" style="gap:var(--uui-size-3)">
          <uui-toggle
            .checked=${this.value.fuzzy}
            label-position="left"
            @change=${this.#onFuzzyChange}
            >${this.localize.term("workflowSearch_fuzzy")}
          </uui-toggle>
          <workflow-tooltip
            .key=${"workflowSearch_fuzzyDescription"}
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
          value=${AdvancedSearchTypeModel.ALL}
          label=${this.localize.term("workflowSearch_allProperties")}
        >
        </uui-radio>
        <uui-radio
          value=${AdvancedSearchTypeModel.SOME}
          label=${this.localize.term("workflowSearch_someProperties")}
        >
        </uui-radio>
        <uui-radio
          value=${AdvancedSearchTypeModel.SINGLE}
          label=${this.localize.term("workflowSearch_singleProperty")}
        >
        </uui-radio>
        <uui-radio
          value=${AdvancedSearchTypeModel.DATATYPE}
          label=${this.localize.term("workflowSearch_datatype")}
        >
        </uui-radio>
        <uui-radio
          value=${AdvancedSearchTypeModel.PROPERTY_EDITOR}
          label=${this.localize.term("workflowSearch_propertyEditor")}
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
