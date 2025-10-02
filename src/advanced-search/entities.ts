import { UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import { PropertyDetailModel, AdvancedSearchTypeModel, SelectableNameKeyPairModel } from "@umbraco-workflow/generated";

export type TypeSearchKey = "dataTypeKey" | "propertyEditorAlias" | undefined;

export interface FieldQueryGeneratorArgs {
  fields: Array<UmbPropertyValueData>;
  props: Array<Partial<PropertyDetailModel>>;
  searchType: AdvancedSearchTypeModel;
  searchText?: string;
  searchEmpty?: boolean;
  typeSearchProperty?: UmbPropertyValueData;
  selectedTypeKey?: string | null;
  availablePropertiesForType: Array<Partial<SelectableNameKeyPairModel>>;
}

export interface AdvancedSearchFieldsValue {
  searchText?: string;
  searchEmpty?: boolean;
  fields?: Array<UmbPropertyValueData>;
  baseFields?: Array<UmbPropertyValueData>;
}

export interface AdvancedSearchFieldElement extends HTMLElement {
  value?: unknown;
}
