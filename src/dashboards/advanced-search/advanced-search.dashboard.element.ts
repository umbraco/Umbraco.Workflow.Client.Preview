import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { UMB_DOCUMENT_TYPE_PICKER_MODAL } from "@umbraco-cms/backoffice/document-type";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { TableQueryModel } from "../../core/entities.js";
import { UmbUserPickerContext } from "../../temp/user-input.context.js";
import { SomeFilter } from "./somefilter.function.js";
import { BaseFieldQueryGenerator } from "./basefield-query-generator.function.js";
import { FieldQueryGenerator } from "./field-query-generator.function.js";
import {
  AdvancedSearchService,
  AdvancedSearchTypeModel,
  WorkflowStatusModel,
  type AdvancedSearchScaffoldResponseModel,
  type LanguageModel,
  type PropertyDetailModel,
  type SelectableContentTypePropertyDetailModel,
  type SelectableNameKeyPairModel,
} from "@umbraco-workflow/generated";

import { WORKFLOW_ITEM_PICKER_MODAL } from "@umbraco-workflow/modal";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export type SelectableLanguageModel = LanguageModel & { selected: boolean };

const elementName = "workflow-advanced-search-dashboard";

@customElement(elementName)
export class AdvancedSearchDashboardElement extends UmbElementMixin(
  LitElement
) {
  @state()
  searchType?: AdvancedSearchTypeModel;

  @state()
  hasSearched = false;

  @state()
  hasSelectedContentTypes = false;

  @state()
  selectedContentTypesVary = false;

  @state()
  selectedType?: SelectableNameKeyPairModel;

  @state()
  showBaseProperties = false;

  @state()
  scaffoldModel?: AdvancedSearchScaffoldResponseModel;

  availableLanguages: Array<SelectableLanguageModel> = [];

  #workflowGlobalContext?: typeof WORKFLOW_CONTEXT.TYPE;

  @state()
  searchModel: TableQueryModel = {
    handler: AdvancedSearchService.postAdvancedSearchSearch,
    meta: {
      fuzzy: false,
    },
  };

  allPropertySearchProperty: Partial<PropertyDetailModel> = {
    alias: "searchTerm",
    name: "Search term",
    value: "",
  };

  baseProperties: Array<Partial<PropertyDetailModel>> = [
    {
      alias: "workflowStatus",
      propertyEditorUiAlias: "checkboxlist",
      name: "Workflow status",
      config: {
        items: Object.values(WorkflowStatusModel)
          .filter(
            (x: string) =>
              x === WorkflowStatusModel.PENDING_APPROVAL ||
              x === WorkflowStatusModel.REJECTED
          )
          .map((x) => ({
            value: x,
            label: x[0].toLowerCase() + x.substring(1),
            selected: false,
          }))
          .sort((a, b) => (a.label < b.label ? -1 : 1)),
      },
    },
    {
      alias: "creatorID",
      name: "Created by",
      propertyEditorUiAlias: "userpicker",
    },
    {
      alias: "writerID",
      name: "Updated by",
      propertyEditorUiAlias: "userpicker",
    },
    {
      alias: "createDate_before",
      name: "Created before",
      propertyEditorUiAlias: "datepicker",
    },
    {
      alias: "createDate_after",
      name: "Created after",
      propertyEditorUiAlias: "datepicker",
    },
    {
      alias: "updateDate_before",
      name: "Updated before",
      propertyEditorUiAlias: "datepicker",
    },
    {
      alias: "updateDate_after",
      name: "Updated after",
      propertyEditorUiAlias: "datepicker",
    },
  ];

  typeSearchProperty: Partial<PropertyDetailModel> = {};
  availableProperties: Array<Partial<PropertyDetailModel>> = [];
  availablePropertiesForType: Array<Partial<PropertyDetailModel>> = [];
  availableDataTypes: Array<SelectableNameKeyPairModel> = [];
  availablePropertyEditors: Array<SelectableNameKeyPairModel> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.#workflowGlobalContext = instance;
      this.#observeVariables();
    });

    this.#getData();
  }

  #observeVariables() {
    if (!this.#workflowGlobalContext) return;

    this.observe(this.#workflowGlobalContext.globalVariables, (variables) => {
      this.availableLanguages = (
        (variables?.availableLanguages ?? []) as Array<SelectableLanguageModel>
      ).map((l) => ({ ...l, ...{ selected: true } }));
    });
  }

  async #getData() {
    const { data } = await tryExecuteAndNotify(
      this,
      AdvancedSearchService.getAdvancedSearchContentTypes()
    );

    data?.contentTypes!.forEach((x) => (x.selected = true));
    this.scaffoldModel = data;
    this.#setHasSelectedContentTypes();
  }

  #clear() {
    this.hasSearched = false;
    this.searchType = undefined;
    this.searchModel.meta = {
      fuzzy: false,
    };
    this.showBaseProperties = false;

    this.availableDataTypes = [];
    this.availablePropertyEditors = [];

    this.availableLanguages.forEach((x) => (x.selected = true));
    this.baseProperties.forEach((x) => (x.value = undefined));
    this.scaffoldModel?.contentTypes?.forEach((x) => (x.selected = false));

    this.#setHasSelectedContentTypes();
  }

  async #search() {
    const requestBody = {
      fields: FieldQueryGenerator({
        props: this.isTypeOrEditorSearch
          ? this.availablePropertiesForType
          : this.availableProperties,
        searchType: this.searchType!,
        allPropertySearchProperty: this.allPropertySearchProperty,
        typeSearchProperty: this.typeSearchProperty,
        typeSearchKey: this.typeSearchKey,
        selectedTypeKey: this.selectedType?.key,
        availablePropertiesForType: this.availablePropertiesForType,
      }),
      baseFields: BaseFieldQueryGenerator(this.baseProperties),
      cultures: this.selectedContentTypesVary
        ? this.#mapSelected(
            this.availableLanguages,
            (x: SelectableLanguageModel) => x.isoCode
          )
        : undefined,
      contentTypes: this.#mapSelected(
        this.scaffoldModel?.contentTypes,
        (x: SelectableContentTypePropertyDetailModel) => x.alias
      ),
      fuzzy: this.searchModel.meta?.fuzzy ?? false,
    };

    this.searchModel.meta!.requestBody = requestBody;
    this.searchModel = { ...this.searchModel };
    this.hasSearched = true;
  }

  #scroll() {
    // gross yuck. need to wait for rendering before attempting to scroll
    setTimeout(() => {
      const searchResults = document.querySelector(".umb-dashboard__content")!;
      searchResults.scrollTo({
        top: searchResults.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }

  async #addContentType() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(
      this,
      UMB_DOCUMENT_TYPE_PICKER_MODAL,
      {
        data: {
          multiple: true,
          hideTreeRoot: true,
        },
        value: {
          selection: [
            ...(this.scaffoldModel?.contentTypes
              ?.filter((x) => x.selected)
              .map((x) => x.key!) ?? []),
          ],
        },
      }
    );

    const { selection } = await modalHandler!.onSubmit();
    this.scaffoldModel?.contentTypes?.forEach((contentType) => {
      contentType.selected =
        (!!contentType.key && selection.includes(contentType.key)) ?? false;
    });

    this.#setHasSelectedContentTypes();
  }

  #removeContentType(type) {
    type.selected = false;
    this.#setHasSelectedContentTypes();
  }

  #setHasSelectedContentTypes() {
    const selectedContentTypes =
      this.scaffoldModel!.contentTypes?.filter((x) => x.selected) ?? [];

    this.hasSelectedContentTypes = selectedContentTypes.length > 0;
    this.selectedContentTypesVary = selectedContentTypes.some((x) => x.varies);

    if (!this.hasSelectedContentTypes) {
      this.availableProperties = [];
    }

    this.requestUpdate();
  }

  async #addSelectedProperty() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_ITEM_PICKER_MODAL, {
      data: {
        multiple: this.searchType != AdvancedSearchTypeModel.SINGLE,
        items: this.availableProperties,
      },
    });

    const { items } = await modalHandler!.onSubmit();
    this.availableProperties = items;
    this.requestUpdate();
  }

  #removeSelectedProperty(prop) {
    prop.selected = false;
    prop.value = undefined;
    this.requestUpdate();
  }

  #onPropertyValueChange(e: Event) {
    const newValue = (e.target as UmbPropertyDatasetElement).value;
    this.availableProperties = this.availableProperties.map((p) => ({
      ...p,
      ...{ value: newValue.find((x) => x.alias === p.alias)?.value },
    }));

    this.requestUpdate();
  }

  async #addSelectedType() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_ITEM_PICKER_MODAL, {
      data: {
        multiple: false,
        items: this.isDataTypeSearch
          ? this.availableDataTypes
          : this.availablePropertyEditors,
      },
    });

    const { items } = await modalHandler!.onSubmit();
    this.selectedType = items.find((x) => x.selected)!;

    const key = this.typeSearchKey;
    if (!key) return;

    this.availablePropertiesForType = this.availableProperties.filter((x) => {
      const valid = x[key] === this.selectedType?.key;
      if (valid) {
        x.selected = true;
      }
      return valid;
    });

    this.typeSearchProperty = { ...this.availablePropertiesForType[0] };
    this.typeSearchProperty.name = "Search term";
  }

  #removeSelectedType() {
    (
      (this.isDataTypeSearch
        ? this.scaffoldModel!.dataTypes
        : this.scaffoldModel!.propertyEditors) ?? []
    ).forEach((e) => {
      e.selected = false;
    });

    this.selectedType = undefined;
  }

  #addUser(property) {
    const pickerContext = new UmbUserPickerContext(this);

    this.observe(pickerContext.selection, (selection) => {
      if (!selection?.[0]) {
        this.#removeUser(property);
        return;
      }

      property.value = {
        name: selection[0],
        id: selection[0],
      };

      this.requestUpdate();
    });

    pickerContext.openPicker({
      multiple: false,
    });
  }

  #removeUser(property) {
    property.value = undefined;
    this.requestUpdate();
  }

  #openContentItem(id) {
    alert("open content item " + id);
  }

  #workflowStatusChange(
    property: Partial<PropertyDetailModel>,
    status: Record<string, any>
  ) {
    status.selected = !status.selected;
    const value = !(<any>property.value)?.length
      ? []
      : (<string>property.value).split(",");

    if (status.selected) {
      value.push(status.value);
    } else {
      const idx = value.indexOf(status.value);
      if (idx !== -1) {
        value.splice(idx, 1);
      }
    }

    property.value = value.join(",");
    this.requestUpdate();
  }

  #basePropertyDateChange(e, prop) {
    prop.value = (e.target as HTMLInputElement).value;
  }

  #getAvailableProperties() {
    const availableProperties = ([] as Array<PropertyDetailModel>)
      .concat(
        ...this.#mapSelected<PropertyDetailModel>(
          this.scaffoldModel?.contentTypes ?? [],
          (x) => x.properties
        )
      )
      .reduce((acc: Array<PropertyDetailModel>, curr: PropertyDetailModel) => {
        if (!acc.find((prop: Record<string, any>) => prop.key === curr.key)) {
          curr.config = {};
          curr.value = undefined;
          curr.selected = false;
          acc.push(curr);
        }

        return acc;
      }, [])
      .sort((a, b) => (a.name! < b.name! ? -1 : 1));

    return availableProperties;
  }

  #updateAvailableProperties(e: InputEvent) {
    this.searchType = (e.target as HTMLInputElement)
      .value as AdvancedSearchTypeModel;

    this.scaffoldModel?.dataTypes?.forEach((d) => (d.selected = false));
    this.scaffoldModel?.propertyEditors?.forEach((p) => (p.selected = false));

    this.selectedType = undefined;
    this.hasSearched = false;

    this.availableProperties = this.#getAvailableProperties();

    this.availableDataTypes = this.#filterAvailableTypes(
      this.scaffoldModel!.dataTypes,
      "dataTypeKey"
    );
    this.availablePropertyEditors = this.#filterAvailableTypes(
      this.scaffoldModel!.propertyEditors,
      "propertyEditorAlias"
    );

    this.requestUpdate();
  }

  #filterAvailableTypes(
    src: Array<SelectableNameKeyPairModel> = [],
    mapper: string
  ) {
    const availableIcons = {};
    const availableTypeKeys = [
      ...new Set(
        this.availableProperties.map((x) => {
          const key = x[mapper];
          availableIcons[key] = x.icon;
          return key;
        })
      ),
    ];

    const dest = src.filter((x) => {
      if (availableTypeKeys.includes(x.key)) {
        x.icon = availableIcons[x.key!];
        return true;
      }
      return false;
    });

    return dest;
  }

  #mapSelected<T>(arr, map): Array<T> {
    return arr.filter((x) => x.selected).map(map) as Array<T>;
  }

  @state()
  get searchDisabled() {
    if (!this.hasSelectedContentTypes || !this.searchType) {
      return true;
    }

    if (this.baseProperties.some((x) => !!x.value)) {
      return false;
    }

    if (this.searchType === AdvancedSearchTypeModel.ALL) {
      return !SomeFilter(this.allPropertySearchProperty);
    }

    if (this.isTypeOrEditorSearch) {
      return !SomeFilter(this.typeSearchProperty);
    }

    if (
      this.searchType === AdvancedSearchTypeModel.SINGLE ||
      this.searchType === AdvancedSearchTypeModel.SOME
    ) {
      return !this.availableProperties.some(SomeFilter);
    }

    return true;
  }

  get hasSelectedProperty() {
    return this.availableProperties.some((x) => x.selected);
  }

  get availablePropertiesForTypeSelectedCount() {
    return this.availablePropertiesForType.filter((x) => x.selected).length;
  }

  get typeSearchKey() {
    if (this.searchType === AdvancedSearchTypeModel.DATATYPE) {
      return "dataTypeKey";
    }

    if (this.searchType === AdvancedSearchTypeModel.PROPERTY_EDITOR) {
      return "propertyEditorAlias";
    }

    return undefined;
  }

  get isDataTypeSearch() {
    return this.searchType === AdvancedSearchTypeModel.DATATYPE;
  }

  get isTypeOrEditorSearch() {
    return (
      this.searchType === AdvancedSearchTypeModel.DATATYPE ||
      this.searchType === AdvancedSearchTypeModel.PROPERTY_EDITOR
    );
  }

  render() {
    return html`
      <uui-box
        .headline=${this.localize.term("workflowSearch_selectContentTypes")}
      >
        <div slot="header-actions">
          ${when(
            !this.selectedContentTypesVary,
            () => html` <workflow-variant-dropdown
              .options=${this.availableLanguages}
            ></workflow-variant-dropdown>`
          )}
        </div>
        <uui-ref-list>
          ${this.scaffoldModel?.contentTypes
            ?.filter((x) => x.selected)
            .map(
              (contentType) =>
                html`<uui-ref-node .name=${contentType.name!}>
                  <uui-icon
                    name=${contentType.icon ?? "folder"}
                    slot="icon"
                  ></uui-icon
                  ><uui-action-bar slot="actions"
                    ><uui-button
                      @click=${() => this.#removeContentType(contentType)}
                      ><uui-icon
                        name="delete"
                      ></uui-icon></uui-button></uui-action-bar
                ></uui-ref-node>`
            )}
        </uui-ref-list>

        <div class="flex">
          <workflow-add-button
            @click=${this.#addContentType}
            labelkey="workflowSearch_addContentTypes"
          >
          </workflow-add-button>
          ${when(
            this.hasSelectedContentTypes,
            () => html` <uui-button label="Remove all" @click=${this.#clear}>
              <uui-icon name="icon-trash"></uui-icon>
            </uui-button>`
          )}
        </div>
      </uui-box>

      ${when(
        this.hasSelectedContentTypes,
        () => html` <uui-box
          .headline=${this.localize.term("workflowSearch_selectSearchType")}
        >
          <div slot="header-actions">
            <div class="flex align-center" style="gap:var(--uui-size-3)">
              <uui-toggle
                .checked=${this.searchModel.meta!.fuzzy}
                label-position="left"
                @change=${() =>
                  (this.searchModel.meta!.fuzzy =
                    !this.searchModel.meta!.fuzzy)}
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
            @change=${this.#updateAvailableProperties}
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
        </uui-box>`
      )}
      ${when(
        this.searchType,
        () => html`
          <uui-box
            .headline=${this.localize.term("workflowSearch_selectSearchFields")}
          >
            <div slot="header-actions">
              <uui-toggle
                .checked=${this.showBaseProperties}
                @change=${() =>
                  (this.showBaseProperties = !this.showBaseProperties)}
                label-position="left"
                label=${this.localize.term("workflowSearch_showBaseProperties")}
              ></uui-toggle>
            </div>
            ${when(
              this.searchType === AdvancedSearchTypeModel.ALL,
              () => html` <umb-property-layout
                .label=${this.allPropertySearchProperty.name!}
              >
                <uui-input
                  slot="editor"
                  type="text"
                  @change=${(e) => {
                    this.allPropertySearchProperty.value = e.target.value;
                    this.requestUpdate();
                  }}
                ></uui-input>
              </umb-property-layout>`
            )}
            ${when(
              this.searchType === AdvancedSearchTypeModel.SOME ||
                this.searchType === AdvancedSearchTypeModel.SINGLE,
              () => html` <uui-ref-list>
                  ${this.availableProperties
                    .filter((x) => x.selected)
                    .map(
                      (prop) => html`
                        <uui-ref-node .name=${prop.name!}>
                          <uui-icon
                            name=${prop.icon ?? "folder"}
                            slot="icon"
                          ></uui-icon
                          ><uui-action-bar slot="actions"
                            ><uui-button
                              @click=${() => this.#removeSelectedProperty(prop)}
                              ><uui-icon
                                name="delete"
                              ></uui-icon></uui-button></uui-action-bar
                        ></uui-ref-node>
                      `
                    )}
                </uui-ref-list>
                ${when(
                  this.searchType === AdvancedSearchTypeModel.SOME ||
                    (this.searchType === AdvancedSearchTypeModel.SINGLE &&
                      !this.hasSelectedProperty),
                  () => html`<workflow-add-button
                    .labelKey=${this.searchType === AdvancedSearchTypeModel.SOME
                      ? "workflowSearch_addProperties"
                      : "workflowSearch_addProperty"}
                    @click=${this.#addSelectedProperty}
                  ></workflow-add-button>`
                )}
                <umb-property-dataset
                  .value=${this
                    .availableProperties as Array<UmbPropertyValueData>}
                  @change=${this.#onPropertyValueChange}
                >
                  ${this.availableProperties
                    .filter((x) => x.selected)
                    .map(
                      (prop) =>
                        html`<umb-property
                          alias=${prop.alias!}
                          label=${prop.name!}
                          property-editor-ui-alias=${prop.propertyEditorUiAlias!}
                          .config=${[]}
                        ></umb-property>`
                    )}
                </umb-property-dataset>`
            )}
            ${when(
              this.isTypeOrEditorSearch,
              () => html` <div>
                  ${when(
                    this.selectedType,
                    () => html`
                      <uui-ref-list>
                        <uui-ref-node .name=${this.selectedType!.name!}>
                          <uui-icon
                            name=${this.selectedType!.icon ?? "folder"}
                            slot="icon"
                          ></uui-icon
                          ><uui-action-bar slot="actions"
                            ><uui-button @click=${this.#removeSelectedType}
                              ><uui-icon
                                name="delete"
                              ></uui-icon></uui-button></uui-action-bar
                        ></uui-ref-node>
                      </uui-ref-list>

                      <ul class="unstyled flex" style="gap: 15px">
                        ${this.availablePropertiesForType.map(
                          (prop) =>
                            html`<li>
                              <uui-checkbox
                                label=${prop.name!}
                                @change=${() =>
                                  (prop.selected = !prop.selected)}
                                ?checked=${prop.selected}
                                ?disabled=${this
                                  .availablePropertiesForTypeSelectedCount ===
                                  1 && prop.selected}
                              ></uui-checkbox>
                            </li>`
                        )}
                      </ul>
                    `,
                    () => html` <workflow-add-button
                      @click=${this.#addSelectedType}
                      .labelKey=${this.localize.term(
                        `workflowSearch_add${
                          this.searchType === AdvancedSearchTypeModel.DATATYPE
                            ? "DataType"
                            : "PropertyEditor"
                        }`
                      )}
                    >
                    </workflow-add-button>`
                  )}
                </div>
                ${when(
                  this.selectedType,
                  () => html` <div style="margin-top: var(--uui-size-5)">
                    <umb-property
                      alias=${this.typeSearchProperty.alias!}
                      label=${this.typeSearchProperty.name!}
                      property-editor-ui-alias=${this.typeSearchProperty
                        .propertyEditorUiAlias!}
                      .config=${[]}
                    ></umb-property>
                  </div>`
                )}`
            )}
            ${when(
              this.showBaseProperties,
              () => html` <hr />
                <div id="baseProperties">
                  ${this.baseProperties.map(
                    (prop) =>
                      html`<umb-property-layout
                        .label=${prop.name!}
                        orientation="vertical"
                      >
                        <div slot="editor">
                          ${when(
                            prop.propertyEditorUiAlias === "datepicker",
                            () => html`<umb-input-date
                              type="datetime-local"
                              .value=${prop.value ?? ""}
                              @change=${(e) =>
                                this.#basePropertyDateChange(e, prop)}
                            ></umb-input-date>`
                          )}
                          ${when(
                            prop.propertyEditorUiAlias === "checkboxlist",
                            () =>
                              html` ${(<any>prop.config)?.items.map(
                                (status) => html`
                                  <uui-checkbox
                                    style="margin-right:var(--uui-size-5)"
                                    value=${status.value}
                                    .label=${this.localize.term(
                                      `workflow_${status.label}`
                                    )}
                                    ?checked=${status.selected}
                                    @change=${() =>
                                      this.#workflowStatusChange(prop, status)}
                                  ></uui-checkbox>
                                `
                              )}`
                          )}
                          ${when(
                            prop.propertyEditorUiAlias === "userpicker",
                            () =>
                              html`${when(
                                prop.value,
                                () => html`<uui-ref-list>
                                  <uui-ref-node-user
                                    .name=${(<any>prop.value)?.name}
                                    ><uui-action-bar slot="actions">
                                      <uui-button
                                        label="Remove"
                                        @click=${() => this.#removeUser(prop)}
                                        >Remove</uui-button
                                      >
                                    </uui-action-bar></uui-ref-node-user
                                  >
                                </uui-ref-list>`,
                                () => html` <workflow-add-button
                                  @click=${() => this.#addUser(prop)}
                                ></workflow-add-button>`
                              )}`
                          )}
                        </div>
                      </umb-property-layout>`
                  )}
                </div>`
            )}
          </uui-box>
        `
      )}

      <div id="searchButtons">
        <uui-button @click=${this.#clear} label="Clear"
          >${this.localize.term("general_clear")}
        </uui-button>
        <uui-button
          @click=${this.#search}
          label="Search"
          look="primary"
          color="positive"
          ?disabled=${this.searchDisabled}
          >${this.localize.term("general_search")}
        </uui-button>
      </div>

      ${when(
        this.hasSearched,
        () => html` <uui-box
          id="searchResults"
          .headline=${this.localize.term("general_searchResults")}
        >
          <workflow-advanced-search-results-table
            .model=${this.searchModel}
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

      uui-box + * {
        margin-top: var(--uui-size-layout-1);
      }

      .flex {
        display: flex;
      }

      .space-between {
        justify-content: space-between;
      }

      .align-center {
        align-items: center;
      }

      workflow-add-button {
        flex: 1;
      }

      #searchButtons {
        display: flex;
        justify-content: center;
      }

      #searchResults {
        position: relative;
        margin-top: var(--uui-size-layout-1);
      }

      .unstyled {
        margin: 0;
        padding: 0;
        list-style-type: none;
      }

      hr {
        margin-top: var(--uui-size-5);
      }

      uui-box {
        container-type: inline-size;
      }

      @container (min-width: 500px) {
        #baseProperties {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-column-gap: 20px;
        }

        #baseProperties > *:nth-child(1) {
          grid-column: 1 / 3;
        }

        #baseProperties > *:nth-child(2) {
          grid-column: 1 / 2;
        }

        #baseProperties > *:nth-child(3) {
          grid-column: 2 / 3;
        }
      }

      @container (min-width: 950px) {
        #baseProperties {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        #baseProperties > *:nth-child(1) {
          grid-column: 1 / 5;
        }

        #baseProperties > *:nth-child(2) {
          grid-column: 1 / 3;
        }

        #baseProperties > *:nth-child(3) {
          grid-column: 3 / 5;
        }
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
