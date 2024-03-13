import type { PropertyDetailModel } from "@umbraco-workflow/generated";

export function ValueMap(prop: Partial<PropertyDetailModel>) {
    let value = prop.value;

    // offset js date back to c# ticks
    if (prop.propertyEditorUiAlias === "datepicker") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        value = date.getTime() * 10000 + 621355968000000000;
      }
    }

    return [prop.alias, value];
}