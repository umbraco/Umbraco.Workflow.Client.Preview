import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  repeat,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import type { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";
import { WORKFLOW_ADVANCEDSEARCH_CONTEXT } from "../../../advanced-search-context.token.js";
import { WORKFLOW_ITEM_PICKER_MODAL } from "../../../modal/index.js";
import { AdvancedSearchFieldElement } from "../../../entities.js";
import {
  AdvancedSearchTypeModel,
  type PropertyDetailModel,
} from "@umbraco-workflow/generated";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";

const elementName = "workflow-advanced-search-property";

@customElement(elementName)
export class WorkflowAdvancedSearchPropertyElement
  extends UmbLitElement
  implements AdvancedSearchFieldElement
{
  #advancedSearchContext?: typeof WORKFLOW_ADVANCEDSEARCH_CONTEXT.TYPE;

  @state()
  private _availableProperties: Array<PropertyDetailModel> = [];

  @state()
  private _searchType?: AdvancedSearchTypeModel;

  @state()
  searchEmpty = false;

  @state()
  value: Array<UmbPropertyValueData<any>> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_ADVANCEDSEARCH_CONTEXT, (context) => {
      if (!context) return;
      this.#advancedSearchContext = context;

      this.observe(
        this.#advancedSearchContext.availableProperties,
        (availableProperties) => {
          this._availableProperties = availableProperties;
        }
      );

      this.observe(this.#advancedSearchContext.searchType, (searchType) => {
        this._searchType = searchType;
        context.setPropertiesSelected([]);
      });
    });
  }

  #onEmptySearchChange(e: UUIBooleanInputEvent) {
    this.searchEmpty = e.target.checked;

    // ensure the selected property is in the value - may not be
    // if selected from modal, then the toggle is flipped.
    if (!this.value.length) {
      const alias = this._availableProperties.find((x) => x.selected)?.alias;
      if (!alias) return;
      this.value = [{ alias, value: undefined }];
    }

    this.dispatchEvent(new UmbChangeEvent());
  }

  #onValueChange(e: Event) {
    // allow empty search for single property only
    this.value = (e.target as UmbPropertyDatasetElement).value.filter((x) =>
      this._searchType === "Some" ? x.value !== undefined : true
    );

    this.dispatchEvent(new UmbChangeEvent());
  }

  async #addSelectedProperty() {
    const selection = await umbOpenModal(this, WORKFLOW_ITEM_PICKER_MODAL, {
      data: {
        multiple: this._searchType != "Single",
        items: this._availableProperties,
      },
    })
      .then((result) => result.selection)
      .catch(() => {});

    if (!selection) return;

    this.#advancedSearchContext?.setPropertiesSelected(selection);
  }

  #removeSelectedProperty(prop) {
    this.#advancedSearchContext?.setPropertySelected(prop.key, false);
  }

  get hasSelectedProperty() {
    return this._availableProperties.some((x) => x.selected);
  }

  render() {
    return html`<uui-ref-list>
        ${repeat(
          this._availableProperties.filter((x) => x.selected),
          (editor) => editor.key,
          (prop) => html`
            <uui-ref-node .name=${prop.name!}>
              <uui-icon name=${prop.icon ?? "folder"} slot="icon"></uui-icon
              ><uui-action-bar slot="actions"
                ><uui-button @click=${() => this.#removeSelectedProperty(prop)}
                  ><uui-icon
                    name="delete"
                  ></uui-icon></uui-button></uui-action-bar
            ></uui-ref-node>
          `
        )}
      </uui-ref-list>
      ${when(
        this._searchType === "Some" ||
          (this._searchType === "Single" && !this.hasSelectedProperty),
        () => html`<uui-button
          look="placeholder"
          .label=${this.localize.term(
            this._searchType === "Some"
              ? "workflow_search_addProperties"
              : "workflow_search_addProperty"
          )}
          @click=${this.#addSelectedProperty}
        ></uui-button>`
      )}
      <umb-property-dataset
        .value=${this.value}
        @change=${this.#onValueChange}
        style=${`display: ${this.searchEmpty ? "none" : "block"}`}
      >
        ${this._availableProperties
          .filter((x) => x.selected)
          .map(
            (prop) =>
              html`<umb-property
                alias=${prop.alias!}
                label=${prop.name!}
                property-editor-ui-alias=${prop.propertyEditorUiAlias!}
              ></umb-property>`
          )}
      </umb-property-dataset>
      ${when(
        this._searchType === "Single" && this.hasSelectedProperty,
        () => html`<umb-property-layout
          alias="emptySearch"
          .label=${this.localize.term("workflow_search_emptyFieldSearch")}
          .description=${this.localize.term(
            "workflow_search_emptyFieldSearchDescription"
          )}
        >
          <uui-toggle
            slot="editor"
            @change=${this.#onEmptySearchChange}
          ></uui-toggle>
        </umb-property-layout>`
      )}`;
  }

  static styles = css`
    [look="placeholder"] {
      width: 100%;
    }

    umb-property-dataset[readonly] {
      pointer-events: none;
    }
  `;
}

export default WorkflowAdvancedSearchPropertyElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchPropertyElement;
  }
}
