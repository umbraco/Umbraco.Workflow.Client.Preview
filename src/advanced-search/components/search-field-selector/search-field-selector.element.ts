import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import { WORKFLOW_ADVANCEDSEARCH_CONTEXT } from "../../advanced-search-context.token.js";
import type { WorkflowAdvancedSearchPropertyElement } from "./views/search-property.element.js";
import { AdvancedSearchTypeModel } from "@umbraco-workflow/generated";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";
import {
  AdvancedSearchFieldElement,
  AdvancedSearchFieldsValue,
} from "../../entities.js";

const elementName = "workflow-advanced-search-field-type";

@customElement(elementName)
export class WorkflowAdvancedSearchFieldTypeElement extends UmbLitElement {
  #advancedSearchContext?: typeof WORKFLOW_ADVANCEDSEARCH_CONTEXT.TYPE;

  @state()
  private _searchType: AdvancedSearchTypeModel | undefined;

  @state()
  private _showBaseProperties = false;

  @state()
  value: AdvancedSearchFieldsValue = {};

  constructor() {
    super();

    this.consumeContext(WORKFLOW_ADVANCEDSEARCH_CONTEXT, (context) => {
      if (!context) return;

      this.#advancedSearchContext = context;

      this.observe(context.searchType, (searchType) => {
        this._searchType = searchType;
      });
    });
  }

  #setValue<T>(e: UmbChangeEvent, setter: (value: T) => void) {
    const value = (e.target as AdvancedSearchFieldElement).value as T;
    setter(value);

    this.#advancedSearchContext?.setFieldValues(this.value);
  }

  #renderAllSearchType() {
    if (this._searchType !== "All") return;

    return html`<workflow-advanced-search-all
      @change=${(e) =>
        this.#setValue<string>(
          e,
          (searchText) => (this.value = { ...this.value, searchText })
        )}
    ></workflow-advanced-search-all>`;
  }

  #renderPropertySearchType() {
    if (this._searchType !== "Single" && this._searchType !== "Some") return;

    return html`<workflow-advanced-search-property
      @change=${(e) =>
        this.#setValue<Array<UmbPropertyValueData>>(e, (fields) => {
          this.value = {
            ...this.value,
            fields,
            searchEmpty: (e.target as WorkflowAdvancedSearchPropertyElement)
              .searchEmpty,
          };
        })}
    ></workflow-advanced-search-property>`;
  }

  #renderEditorSearchType() {
    if (
      this._searchType !== "Datatype" &&
      this._searchType !== "PropertyEditor"
    )
      return;

    return html`<workflow-advanced-search-editor
      @change=${(e) =>
        this.#setValue<Array<UmbPropertyValueData>>(
          e,
          (fields) => (this.value = { ...this.value, fields })
        )}
    ></workflow-advanced-search-editor>`;
  }

  #renderBasePropertySearchType() {
    if (!this._showBaseProperties) return;

    return html`<workflow-advanced-search-base-property
      @change=${(e) =>
        this.#setValue<Array<UmbPropertyValueData>>(
          e,
          (baseFields) => (this.value = { ...this.value, baseFields })
        )}
    ></workflow-advanced-search-base-property>`;
  }

  render() {
    if (!this._searchType) return;

    return html`
      <uui-box
        .headline=${this.localize.term("workflow_search_selectSearchFields")}
      >
        <div slot="header-actions">
          <uui-toggle
            .checked=${this._showBaseProperties}
            @change=${() =>
              (this._showBaseProperties = !this._showBaseProperties)}
            label-position="left"
            label=${this.localize.term("workflow_search_showBaseProperties")}
          ></uui-toggle>
        </div>

        ${this.#renderAllSearchType()} ${this.#renderPropertySearchType()}
        ${this.#renderEditorSearchType()}
        ${this.#renderBasePropertySearchType()}
      </uui-box>
    `;
  }
}

export default WorkflowAdvancedSearchFieldTypeElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchFieldTypeElement;
  }
}
