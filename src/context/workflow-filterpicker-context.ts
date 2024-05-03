import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type { WorkflowFilterConfig } from "@umbraco-workflow/components";
import { WORKFLOW_FILTER_PICKER_MODAL } from "@umbraco-workflow/modal";
import type { FilterModel } from "@umbraco-workflow/generated";

export class WorkflowFilterPickerContext extends UmbControllerBase {
  #config = new UmbObjectState<WorkflowFilterConfig | undefined>(undefined);
  config = this.#config.asObservable();

  #filters = new UmbObjectState<FilterModel | undefined>(undefined);
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

    const modalContext = this.#modalManager.open(
      this,
      WORKFLOW_FILTER_PICKER_MODAL,
      {
        data: {
          config: this.getConfig(),
        },
      }
    );

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
