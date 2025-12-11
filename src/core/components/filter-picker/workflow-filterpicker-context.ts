import {
  UmbNumberState,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_FILTER_PICKER_MODAL } from "./modal/filter-picker-modal.token.js";
import type { WorkflowFilterConfig } from "@umbraco-workflow/components";
import type { WorkflowSearchFilterModel } from "@umbraco-workflow/generated";

export class WorkflowFilterPickerContext extends UmbControllerBase {
  #config = new UmbObjectState<WorkflowFilterConfig | undefined>(undefined);
  config = this.#config.asObservable();

  #value = new UmbObjectState<WorkflowSearchFilterModel>({});
  value = this.#value.asObservable();

  #activeCount = new UmbNumberState(0);
  activeCount = this.#activeCount.asObservable();

  async openPicker() {
    const result = await umbOpenModal(this, WORKFLOW_FILTER_PICKER_MODAL, {
      data: {
        config: this.getConfig(),
      },
      value: this.#value.getValue(),
    }).catch(() => {});

    if (!result) return;
    this.setValue(result);
  }

  getConfig() {
    return this.#config.getValue();
  }

  setValue(value: WorkflowSearchFilterModel) {
    this.#value.setValue(value);
    this.#activeCount.setValue(this.getActive().length);
  }

  setConfig(config?: WorkflowFilterConfig) {
    this.#config.setValue(config);

    if (!config?.filters) return;

    const filterModel = Object.fromEntries(
      config.filters.map((f) => [f.alias, f.value])
    );

    this.setValue(filterModel);
  }

  getActive() {
    const values = this.#value.getValue();
    return (
      this.getConfig()?.filters?.filter((f) => {
        const value = values[f.alias];

        // if no ui, the filter is hidden and not editable, so
        // should not impact the active count
        if (value === undefined || !f.ui) return false;

        // value is a daterange
        if (Object.hasOwn(value, "from")) {
          return value.from || value.to;
        }

        // handle array
        if (Array.isArray(value) && value.some((x) => x.length)) {
          return true;
        }

        return value !== undefined && value.toString() != "";
      }) ?? []
    );
  }
}
