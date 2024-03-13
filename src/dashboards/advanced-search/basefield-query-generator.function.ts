import { ValueMap } from './valuemap.function.js';
import type { PropertyDetailModel } from "@umbraco-workflow/generated";

export function BaseFieldQueryGenerator(props: Array<Partial<PropertyDetailModel>>) {
  const baseFields = Object.fromEntries(
    props
      .filter((x) => !!x.value)
      .map((x) => {
        const v = ValueMap(x);

        if (x.propertyEditorUiAlias === "userpicker" && x.value) {
          v[1] = x.value.id;
        }

        return v;
      })
  );

  return baseFields;
}
