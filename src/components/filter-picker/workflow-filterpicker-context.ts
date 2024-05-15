import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_FILTER_PICKER_MODAL } from './modal/filter-picker-modal.token.js';
import type { WorkflowFilterConfig } from "@umbraco-workflow/components";
import type { FilterModel } from "@umbraco-workflow/generated";

export class WorkflowFilterPickerContext extends UmbControllerBase {
  #config = new UmbObjectState<WorkflowFilterConfig | undefined>(undefined);
  config = this.#config.asObservable();

  #filters = new UmbObjectState<FilterModel | undefined>(undefined);
  filters = this.#filters.asObservable();

  #activeCount = new UmbObjectState<number>(0);
  activeCount = this.#activeCount.asObservable();

  async openPicker() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_FILTER_PICKER_MODAL, {
      data: {
        config: this.getConfig(),
      },
    });

    await modalHandler.onSubmit().catch(() => undefined);
    this.setConfig(modalHandler.getValue().config);
  }

  getConfig() {
    return this.#config.getValue();
  }

  setConfig(config?: WorkflowFilterConfig) {
    this.#config.setValue(config);

    if (!config?.filters.length) return;

    const filterModel = Object.fromEntries(
      config.filters.map((f) => [f.alias, f.value])
    );

    this.#filters.setValue(filterModel);
    this.#activeCount.setValue(this.getActive().length);
  }

  getActive() {
    return (
      this.getConfig()?.filters?.filter((f) => {
        if (f.value === undefined) return false;

        // value is a daterange
        if (Object.prototype.hasOwnProperty.call(f.value, "from")) {
          return f.value.from || f.value.to;
        }

        // handle array
        if (Array.isArray(f.value) && f.value.some((x) => x.length)) {
          return true;
        }

        return f.value !== undefined && f.value.toString() != "";
      }) ?? []
    );
  }
}
