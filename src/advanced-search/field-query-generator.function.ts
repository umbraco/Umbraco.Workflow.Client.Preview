import { SomeFilter } from "./somefilter.function.js";
import { ValueMap } from "./valuemap.function.js";
import {
  AdvancedSearchTypeModel,
  type PropertyDetailModel,
} from "@umbraco-workflow/generated";

export type TypeSearchKey = "dataTypeKey" | "propertyEditorAlias" | undefined;

export type FieldQueryGeneratorArgs = {
  props: Array<Partial<PropertyDetailModel>>;
  searchType: AdvancedSearchTypeModel;
  allPropertySearchProperty: Partial<PropertyDetailModel>;
  typeSearchProperty: Partial<PropertyDetailModel>;
  typeSearchKey: TypeSearchKey;
  selectedTypeKey?: string | null;
  availablePropertiesForType: Array<Partial<PropertyDetailModel>>;
};

export function FieldQueryGenerator(args: FieldQueryGeneratorArgs) {
  // keep all properties, and update value to same
  const allFilter = (p) => {
    if (!SomeFilter(args.allPropertySearchProperty)) return false;
    p.value = args.allPropertySearchProperty.value;
    return true;
  };

  const dataTypeFilter = (p) => {
    if (!args.typeSearchKey || !SomeFilter(args.typeSearchProperty)) {
      return false;
    }

    // check the type has not been excluded in the ui
    const type = args.availablePropertiesForType.find((x) => x.key === p.key);
    if (!type?.selected) {
      return false;
    }

    if (p[args.typeSearchKey] === args.selectedTypeKey) {
      p.value = args.typeSearchProperty?.value;
      return true;
    }

    return false;
  };

  const isSingleOrSomeSearch = () => {
    return (
      args.searchType === AdvancedSearchTypeModel.SINGLE ||
      args.searchType === AdvancedSearchTypeModel.SOME
    );
  };

  const isTypeOrEditorSearch = () => {
    return (
      args.searchType === AdvancedSearchTypeModel.DATATYPE ||
      args.searchType === AdvancedSearchTypeModel.PROPERTY_EDITOR
    );
  };

  const fields = Object.fromEntries(
    args.props
      .filter((p) => {
        if (isSingleOrSomeSearch()) {
          return SomeFilter(p);
        } else if (args.searchType === AdvancedSearchTypeModel.ALL) {
          return allFilter(p);
        } else if (isTypeOrEditorSearch()) {
          return dataTypeFilter(p);
        }

        return false;
      })
      .map(ValueMap)
  );

  return fields;
}
