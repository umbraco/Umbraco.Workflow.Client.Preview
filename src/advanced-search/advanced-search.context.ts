import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import {
  UmbArrayState,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { ManifestPropertyEditorUi } from "@umbraco-cms/backoffice/property-editor";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  makeArray,
  type SelectableLanguageModel,
} from "@umbraco-workflow/core";
import {
  AdvancedSearchResponseModel,
  AdvancedSearchService,
  AdvancedSearchTypeModel,
  type PropertyDetailModel,
  type SelectableContentTypePropertyDetailModel,
  type SelectableNameKeyPairModel,
} from "@umbraco-workflow/generated";
import { AdvancedSearchFieldsValue, TypeSearchKey } from "./entities.js";
import { WORKFLOW_ADVANCEDSEARCH_CONTEXT_ALIAS } from "./constants.js";
import { FieldQueryGenerator } from "./field-query-generator.controller.js";
import { UmbPropertyValueData } from "@umbraco-cms/backoffice/property";

export class WorkflowAdvancedSearchContext extends UmbControllerBase {
  readonly #searchTypes = makeArray<AdvancedSearchTypeModel>(
    "All",
    "Datatype",
    "Null",
    "PropertyEditor",
    "Single",
    "Some"
  );

  #languages = new UmbArrayState<SelectableLanguageModel>([], (x) => x.unique);

  #contentTypes = new UmbArrayState<SelectableContentTypePropertyDetailModel>(
    [],
    (x) => x.key
  );

  #availablePropertyEditors = new UmbArrayState<SelectableNameKeyPairModel>(
    [],
    (x) => x?.key
  );
  #availableDataTypes = new UmbArrayState<SelectableNameKeyPairModel>(
    [],
    (x) => x?.key
  );

  #availableProperties = new UmbArrayState<PropertyDetailModel>(
    [],
    (x) => x.key
  );

  #availablePropertiesForType = new UmbArrayState<PropertyDetailModel>(
    [],
    (x) => x.key
  );

  #searchType = new UmbObjectState<AdvancedSearchTypeModel | undefined>(
    undefined
  );

  #fieldValues = new UmbObjectState<AdvancedSearchFieldsValue>({});
  #searchResults = new UmbObjectState<AdvancedSearchResponseModel | undefined>(
    undefined
  );

  #fuzzy = false;
  #dataTypes?: Array<SelectableNameKeyPairModel>;
  #propertyEditors?: Array<SelectableNameKeyPairModel>;

  languages = this.#languages.asObservable();
  contentTypes = this.#contentTypes.asObservable();
  availableProperties = this.#availableProperties.asObservable();
  availablePropertyEditors = this.#availablePropertyEditors.asObservable();
  availableDataTypes = this.#availableDataTypes.asObservable();
  availablePropertiesForType = this.#availablePropertiesForType.asObservable();
  searchType = this.#searchType.asObservable();
  fieldValues = this.#fieldValues.asObservable();
  searchResults = this.#searchResults.asObservable();

  #editorUis: Array<ManifestPropertyEditorUi> = [];

  readonly selectedContentTypes = this.#contentTypes.asObservablePart(
    (x) => x.filter((y) => y?.selected) ?? []
  );

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_ADVANCEDSEARCH_CONTEXT_ALIAS);

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.languages, (languages) => {
        this.#languages.setValue(
          languages.map((l) => ({ ...l, ...{ selected: true } }))
        );
      });
    });

    this.observe(this.selectedContentTypes, (selectedContentTypes) => {
      this.#setAvailableProperties(selectedContentTypes);
      this.#setAvailableTypesAndEditors();
    });

    this.observe(this.searchType, () => {
      this.#setAvailableTypesAndEditors();
    });
  }

  async hostConnected() {
    super.hostConnected();

    this.#editorUis = await firstValueFrom(
      umbExtensionsRegistry.byType("propertyEditorUi")
    );

    const { data, error } = await tryExecute(
      this,
      AdvancedSearchService.getAdvancedSearchContentTypes()
    );

    if (error || !data) return;

    data.contentTypes.forEach((x) => {
      x.selected = true;
    });

    this.#contentTypes.setValue(data.contentTypes ?? []);
    this.#dataTypes = data.dataTypes ?? [];
    this.#propertyEditors = data.propertyEditors ?? [];
  }

  setSearchType(searchType: AdvancedSearchTypeModel) {
    this.#searchType.setValue(searchType);
  }

  setFuzzy(fuzzy: boolean) {
    this.#fuzzy = fuzzy;
  }

  setFieldValues(fieldValues: AdvancedSearchFieldsValue) {
    this.#fieldValues.setValue(fieldValues);
  }

  setContentTypeSelected(key: string, selected: boolean) {
    this.#contentTypes.updateOne(key, { selected });
  }

  setPropertiesSelected(keys: Array<string | null>) {
    const properties = this.#availableProperties.getValue().map((p) => ({
      ...p,
      ...{ selected: keys.includes(p.key) },
    }));

    this.#availableProperties.setValue(properties);
  }

  setPropertySelected(key: string, selected: boolean) {
    this.#availableProperties.updateOne(key, { selected, value: undefined });
  }

  setDataTypeSelected(key?: string, selected = false) {
    this.#dataTypes?.forEach(
      (x) => (x.selected = x.key === key ? selected : false)
    );
  }

  setPropertyEditorSelected(key?: string, selected = false) {
    if (key && this.#dataTypes) {
      const dataType = this.#dataTypes.find((x) => x.key === key);
      if (dataType) {
        dataType.selected = selected;
      }

      return;
    }

    this.#propertyEditors?.forEach((x) => (x.selected = false));
  }

  setAvailablePropertiesForType(
    typeSearchKey: TypeSearchKey,
    selectedTypeKey?: string | null
  ) {
    this.#availablePropertiesForType.setValue(
      this.#availableProperties
        .getValue()
        .filter((x) => x[typeSearchKey!] === selectedTypeKey)
        .map((x) => ({ ...x, ...{ selected: true } }))
    );
  }

  clear() {
    this.#fieldValues.setValue({});
    this.#fuzzy = false;
    this.#searchType.setValue(undefined);
  }

  async search() {
    const availablePropertiesForType =
      this.#availablePropertiesForType.getValue();

    const searchType = this.#searchType.getValue();
    if (!searchType) return;

    const fieldValues = this.#fieldValues.getValue();

    const props =
      searchType === "Datatype" || searchType === "PropertyEditor"
        ? availablePropertiesForType
        : this.#availableProperties.getValue();

    const generator = new FieldQueryGenerator({
      fields: fieldValues.fields ?? [],
      props,
      searchType,
      searchText: fieldValues.searchText,
      searchEmpty: fieldValues.searchEmpty,
      typeSearchProperty: fieldValues.fields?.[0],
      selectedTypeKey: fieldValues.fields?.[0].alias,
      availablePropertiesForType,
    });

    const toObject = (arr: Array<UmbPropertyValueData> = []) =>
      arr.reduce((obj, item) => {
        obj[item.alias as string] = item.value;
        return obj;
      }, {}) ?? ({} as Record<string, unknown>);

    const searchParams = {
      fields: generator.generate(),
      baseFields: toObject(fieldValues.baseFields),
      searchType,
      cultures: this.#languages
        .getValue()
        .filter((x) => x.selected)
        .map((x) => x.unique),
      contentTypes: (await firstValueFrom(this.selectedContentTypes)).map(
        (x) => x.alias as string
      ),
      fuzzy: this.#fuzzy,
      category: "content",
      skip: 0,
      take: 1000,
    };

    const { data } = await tryExecute(
      this,
      AdvancedSearchService.postAdvancedSearchSearch({
        body: searchParams,
      })
    );

    this.#searchResults.setValue(data);
  }

  #setAvailableProperties(
    selectedContentTypes: Array<SelectableContentTypePropertyDetailModel>
  ) {
    const availableProperties = ([] as Array<PropertyDetailModel>)
      .concat(
        ...this.#mapSelected<PropertyDetailModel>(
          selectedContentTypes,
          (x: SelectableContentTypePropertyDetailModel) => x.properties
        )
      )
      .reduce((acc: Array<PropertyDetailModel>, curr: PropertyDetailModel) => {
        if (!acc.find((prop: PropertyDetailModel) => prop.key === curr.key)) {
          const editorUi = this.#editorUis.find(
            (x) => x.alias === curr.propertyEditorUiAlias
          );

          acc.push({
            ...curr,
            ...{
              value: undefined,
              selected: false,
              config: { editorLabel: editorUi?.meta.label },
              icon: editorUi?.meta.icon ?? "",
            },
          });
        }

        return acc;
      }, [])
      .filter(
        (x, i, arr) =>
          arr.findIndex((y) => y.name === x.name && y.alias === x.alias) === i
      )
      .sort((a, b) => (a.name! < b.name! ? -1 : 1));

    this.#availableProperties.setValue(availableProperties);
  }

  #setAvailableTypesAndEditors() {
    this.#availablePropertyEditors.setValue(
      this.#filterAvailableTypes(this.#propertyEditors, "propertyEditorAlias")
    );

    this.#availableDataTypes.setValue(
      this.#filterAvailableTypes(this.#dataTypes, "dataTypeKey")
    );
  }

  #filterAvailableTypes(
    src: Array<SelectableNameKeyPairModel> = [],
    mapper: TypeSearchKey
  ) {
    if (!mapper) return [];

    const icons = {};
    const editorLabels = {};

    const availableTypeKeys = [
      ...new Set(
        this.#availableProperties.getValue().map((x) => {
          const key = x[mapper];
          if (!key) return;

          icons[key] = x.icon;
          editorLabels[key] = x.config?.editorLabel;
          return key;
        })
      ),
    ];

    const dest = src
      .filter((x) => x.key && availableTypeKeys.includes(x.key))
      .map((x) => ({
        ...x,
        ...{
          icon: icons[x.key!],
          selected: false,
          name:
            mapper === "propertyEditorAlias" ? editorLabels[x.key!] : x.name,
        },
      }));

    return dest;
  }

  #mapSelected<T>(arr, map): Array<T> {
    return arr.filter((x) => x.selected).map(map) as Array<T>;
  }
}

export { WorkflowAdvancedSearchContext as api };
