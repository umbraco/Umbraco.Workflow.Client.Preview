import type { Filter, WorkflowFilterConfig } from "../types.js";

export class BaseFilters implements WorkflowFilterConfig {
  count = 0;
  changed = false;
  filters: Array<Filter<any>> = [];

  setFromArgs(args: Record<string, any>) {
    Object.keys(args).forEach((key) => {
      const filter = this.filters?.find((f) => f.alias === key);
      if (filter) {
        filter.default = args[key];
      }
      else {
        const hiddenFilter = {
          alias: key,
          default: args[key],
        }

        this.filters.push(hiddenFilter);
      }
    });
  }

  disable(keys: Array<string>) {
    if (!keys.length) return;

    keys.forEach((key) => {
      const filter = this.filters?.find((f) => f.alias === key);
      if (!filter) return;
      filter.disabled = true;
    });
  }

  setFromDefaults() {
    this.filters.forEach((f) => {
      f.value = f.default;
    });
  }
}
