import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { ADVANCED_SEARCH_CONTEXT } from "../../../advanced-search-context.token.js";
import { WORKFLOW_ITEM_PICKER_MODAL } from "../../../modal/index.js";
import { AdvancedSearchFieldElement } from "../../../entities.js";
import {
  AdvancedSearchTypeModel,
  type PropertyDetailModel,
  type SelectableNameKeyPairModel,
} from "@umbraco-workflow/generated";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";

const elementName = "workflow-advanced-search-editor";

@customElement(elementName)
export class WorkflowAdvancedSearchEditorElement
  extends UmbLitElement
  implements AdvancedSearchFieldElement
{
  #advancedSearchContext?: typeof ADVANCED_SEARCH_CONTEXT.TYPE;

  @state()
  value: Array<UmbPropertyValueData<any>> = [];

  @state()
  private _selectedType?: SelectableNameKeyPairModel;

  @state()
  private _searchType?: AdvancedSearchTypeModel;

  @state()
  private _availablePropertiesForType: Array<SelectableNameKeyPairModel> = [];

  @state()
  private _availableDataTypes: Array<SelectableNameKeyPairModel> = [];

  @state()
  private _availablePropertyEditors: Array<SelectableNameKeyPairModel> = [];

  private _typeSearchProperty: Partial<PropertyDetailModel> = {};

  constructor() {
    super();

    this.consumeContext(ADVANCED_SEARCH_CONTEXT, (context) => {
      if (!context) return;
      this.#advancedSearchContext = context;

      this.observe(context.searchType, (searchType) => {
        this._searchType = searchType;
      });

      this.observe(
        this.#advancedSearchContext.availableDataTypes,
        (availableDataTypes) => {
          this._availableDataTypes = availableDataTypes;
        }
      );

      this.observe(
        this.#advancedSearchContext.availablePropertyEditors,
        (availablePropertyEditors) => {
          this._availablePropertyEditors = availablePropertyEditors;
        }
      );

      this.observe(
        this.#advancedSearchContext.availablePropertiesForType,
        (availablePropertiesForType) => {
          this._availablePropertiesForType = availablePropertiesForType;

          const prop = this._availablePropertiesForType[0];
          const { key, ...typeSearchProperty } = {
            ...prop,
            ...{ name: "Search term", icon: undefined },
          };

          this._typeSearchProperty = typeSearchProperty;
        }
      );
    });
  }

  #onValueChange(e: Event) {
    this.value = (e.target as UmbPropertyDatasetElement).value;
    this.dispatchEvent(new UmbChangeEvent());
  }

  async #addSelectedType() {
    const items =
      this._searchType === AdvancedSearchTypeModel.DATATYPE
        ? this._availableDataTypes
        : this._availablePropertyEditors;

    const result = await umbOpenModal(this, WORKFLOW_ITEM_PICKER_MODAL, {
      data: {
        multiple: false,
        items,
      },
    }).catch(() => {});

    if (!result) return;

    const selectedType = result.selection[0];
    this._selectedType = items.find((x) => x.key === selectedType);

    const typeSearchKey = this.#typeSearchKey();
    if (!typeSearchKey) return;

    this.#advancedSearchContext?.setAvailablePropertiesForType(
      typeSearchKey,
      selectedType
    );
  }

  #removeSelectedType() {
    this._selectedType = undefined;
  }

  #togglePropertySelected(key?: string | null) {
    const prop = this._availablePropertiesForType.find((x) => x.key === key);
    if (!prop) return;
    prop.selected = !prop?.selected;

    this.requestUpdate("_availablePropertiesForType");
  }

  #availablePropertiesForTypeSelectedCount() {
    return this._availablePropertiesForType.filter((x) => x.selected).length;
  }

  #typeSearchKey() {
    if (this._searchType === AdvancedSearchTypeModel.DATATYPE) {
      return "dataTypeKey";
    }

    if (this._searchType === AdvancedSearchTypeModel.PROPERTY_EDITOR) {
      return "propertyEditorAlias";
    }

    return undefined;
  }

  render() {
    return html`<div>
        ${when(
          this._selectedType,
          () => html`
            <uui-ref-list>
              <uui-ref-node .name=${this._selectedType!.name!}>
                <umb-icon
                  name=${this._selectedType!.icon ?? "icon-folder"}
                  slot="icon"
                ></umb-icon
                ><uui-action-bar slot="actions"
                  ><uui-button @click=${this.#removeSelectedType}
                    ><uui-icon
                      name="delete"
                    ></uui-icon></uui-button></uui-action-bar
              ></uui-ref-node>
            </uui-ref-list>

            <uui-ref-list id="nested">
              ${this._availablePropertiesForType.map(
                (prop) =>
                  html`
                    <uui-ref-list>
                      <uui-ref-node
                        .name=${prop.name ?? ""}
                        ?disabled=${!prop.selected ||
                        this.#availablePropertiesForTypeSelectedCount() === 1}
                      >
                        <umb-icon name=${prop.icon ?? ""} slot="icon"></umb-icon
                        ><uui-action-bar slot="actions"
                          ><uui-button
                            .label=${this.localize.term("general_enable") +
                            prop.selected}
                            @click=${() =>
                              this.#togglePropertySelected(prop.key)}
                          ></uui-button></uui-action-bar
                      ></uui-ref-node>
                    </uui-ref-list>
                  `
              )}
            </uui-ref-list>
          `,
          () => html` <uui-button
            @click=${this.#addSelectedType}
            look="placeholder"
            .label=${this.localize.term(
              `workflowSearch_add${
                this._searchType === AdvancedSearchTypeModel.DATATYPE
                  ? "DataType"
                  : "PropertyEditor"
              }`
            )}
          ></uui-button>`
        )}
      </div>
      ${when(
        this._selectedType,
        () => html`<umb-property-dataset
          @change=${this.#onValueChange}
          .value=${this.value}
        >
          <umb-property
            .alias=${this._typeSearchProperty.alias ?? ""}
            .label=${this._typeSearchProperty.name}
            property-editor-ui-alias=${this._typeSearchProperty
              .propertyEditorUiAlias!}
          ></umb-property>
        </umb-property-dataset>`
      )}`;
  }

  static styles = css`
    .flex {
      display: flex;
    }

    #nested {
      margin-left: var(--uui-size-9);
    }

    [look="placeholder"] {
      width: 100%;
    }
  `;
}

export default WorkflowAdvancedSearchEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchEditorElement;
  }
}
