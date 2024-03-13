import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { FilterTypeModel } from "@umbraco-workflow/generated";
import type { WorkflowFilterConfig, WorkflowFilterValueSet } from "@umbraco-workflow/components";
import { WORKFLOW_FILTER_PICKER_MODAL } from "@umbraco-workflow/modal";

export class WorkflowFilterPickerContext extends UmbControllerBase {
  #config = new UmbObjectState<WorkflowFilterConfig | undefined>(undefined);
  config = this.#config.asObservable();

  #filters = new UmbObjectState<WorkflowFilterValueSet | undefined>(undefined);
  filters = this.#filters.asObservable();

  #activeCount = new UmbObjectState<number>(0);
  activeCount = this.#activeCount.asObservable();

  #modalManager?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;

  constructor(host: UmbControllerHostElement) {
    super(host);
  }

  async hostConnected() {
    super.hostConnected();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalManager = instance;
    });
  }

  async openPicker() {
    if (!this.#modalManager) return;

    const modalContext = this.#modalManager.open(this, WORKFLOW_FILTER_PICKER_MODAL, {
      data: {
        config: this.getConfig(),
      },
    });

    const { config } = await modalContext.onSubmit();
    this.setConfig(config);
  }

  getConfig() {
    return this.#config.getValue();
  }

  setConfig(config?: WorkflowFilterConfig) {
    this.#config.setValue(config);

    if (!config?.filters.length) return;

    const filterModel = Object.fromEntries(
      config.filters.map((f) => [
        f.alias,
        {
          value: f.value,
          type: Object.keys(FilterTypeModel).indexOf(
            f.ui.split("-").at(1)!.toUpperCase() as FilterTypeModel
          ),
        },
      ])
    );

    this.#filters.setValue(filterModel);
    this.#activeCount.setValue(this.getActive().length);
  }

  getActive() {
    return (
      this.getConfig()?.filters?.filter(
        (f) =>
          (!Array.isArray(f.value) &&
            f.value !== undefined &&
            f.value.toString() != "") ||
          (Array.isArray(f.value) && f.value.some((x) => x.length))
      ) ?? []
    );
  }
}
