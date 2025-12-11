import {
  AdvancedSearchTypeModel,
  type PropertyDetailModel,
} from "@umbraco-workflow/generated";
import { FieldQueryGeneratorArgs, TypeSearchKey } from "./entities.js";

export class FieldQueryGenerator {
  #args: FieldQueryGeneratorArgs;
  #typeSearchKey: TypeSearchKey;

  constructor(args: FieldQueryGeneratorArgs) {
    this.#args = args;
    this.#typeSearchKey = this.#typeSearchKeyMapper(args.searchType);
  }

  public generate() {
    const fields: Record<string, any> = {};

    this.#args.props.forEach((p) => {
      const prop = { ...p };
      let include = false;
      if (this.#isSingleOrSomeSearch()) {
        include = this.#propertyFilter(prop);
      } else if (this.#args.searchType === "All") {
        include = this.#allFilter(prop);
      } else if (this.#isTypeOrEditorSearch()) {
        include = this.#dataTypeFilter(prop);
      }
      if (include && prop.alias) {
        fields[prop.alias] = prop.value;
      }
    });

    return fields;
  }

  #setValue(p: Partial<PropertyDetailModel>, value: any) {
    p.value = value;
  }

  #typeSearchKeyMapper(searchType: AdvancedSearchTypeModel): TypeSearchKey {
    if (searchType === "Datatype") {
      return "dataTypeKey";
    }

    if (searchType === "PropertyEditor") {
      return "propertyEditorAlias";
    }

    return undefined;
  }

  // keep all properties, and update value to same
  #allFilter(p: Partial<PropertyDetailModel>): boolean {
    if (!this.#args.searchText) return false;

    this.#setValue(p, this.#args.searchText);
    return true;
  }

  #dataTypeFilter(p: Partial<PropertyDetailModel>): boolean {
    if (!this.#typeSearchKey || !this.#dataTypeHasValue()) {
      return false;
    }

    // check the type has not been excluded in the ui
    const type = this.#args.availablePropertiesForType.find(
      (x) => x.key === p.key
    );
    if (type?.selected !== true) {
      return false;
    }

    if (p.alias === this.#args.selectedTypeKey) {
      this.#setValue(p, this.#args.typeSearchProperty?.value);
      return true;
    }

    return false;
  }

  #emptyOrUndefined(v: unknown): boolean {
    return v === undefined || v === "";
  }

  #propertyFilter(p: Partial<PropertyDetailModel>): boolean {
    if (!p.selected) return false;

    const fieldValue = this.#args.fields.find(
      (x) => x.alias === p.alias
    )?.value;

    const isEmptyOrUndefined = this.#emptyOrUndefined(fieldValue);

    if (isEmptyOrUndefined && this.#args.searchType === "Some") {
      return false;
    }

    this.#setValue(
      p,
      isEmptyOrUndefined && this.#args.searchEmpty ? "<EMPTY>" : fieldValue
    );

    return true;
  }

  #isSingleOrSomeSearch(): boolean {
    return (
      this.#args.searchType === "Single" || this.#args.searchType === "Some"
    );
  }

  #isTypeOrEditorSearch(): boolean {
    return (
      this.#args.searchType === "Datatype" ||
      this.#args.searchType === "PropertyEditor"
    );
  }

  #dataTypeHasValue(): boolean {
    const p = this.#args.typeSearchProperty;
    if (!p) return false;

    return (
      p.value !== null &&
      p.value !== undefined &&
      p.value !== "" &&
      p.value !== "0"
    );
  }
}
