import {
  html,
  ifDefined,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {
  WORKFLOW_MANAGER_CONTEXT,
  type WorkflowState,
} from "@umbraco-workflow/context";
import {
  InitiateWorkflowArgs,
  ManifestEntityWorkflowExpansion,
  WORKFLOW_EXPANSION_TYPE_ALIAS,
} from "@umbraco-workflow/core";
import { UMB_ENTITY_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import {
  UmbDataPathPropertyValueQuery,
  UmbValidationContext,
} from "@umbraco-cms/backoffice/validation";
import {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { PropertyEditorSettingsProperty } from "@umbraco-cms/backoffice/property-editor";
import { PropertyTypeValidationModel } from "@umbraco-cms/backoffice/external/backend-api";

type DatasetValueModel = Array<
  UmbPropertyValueData &
    PropertyEditorSettingsProperty & {
      validation?: PropertyTypeValidationModel;
      core?: boolean;
      dataPath: string;
    }
>;

export abstract class WorkflowSubmitModalBaseElement extends UmbModalBaseElement {
  #workflowManager?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  readonly validationContext = new UmbValidationContext(this);

  abstract getInitiatorArgs(
    value: Record<string, unknown>
  ): Partial<InitiateWorkflowArgs>;

  @state()
  private _state?: WorkflowState;

  @state()
  private _expanders?: Array<ManifestEntityWorkflowExpansion>;

  @state()
  private _datasetValue: DatasetValueModel = [];

  #varies?: () => Promise<boolean>;
  #init: Promise<unknown>;

  constructor(args?: { varies?: () => Promise<boolean> }) {
    super();

    this.#varies = args?.varies;

    this.#init = Promise.all([
      this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, (context) => {
        if (!context) return;
        this.#observeWorkflowExpansion(context.getEntityType());
      }).asPromise(),

      this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
        if (!context) return;
        this.#workflowManager = context;
        this.#observeWorkflowState();
      }).asPromise(),
    ]);
  }

  async connectedCallback() {
    super.connectedCallback();

    await this.#init;
    await this.#buildDataset();
  }

  #observeWorkflowExpansion(entityType: string) {
    this.observe(
      umbExtensionsRegistry.byTypeAndFilter(
        WORKFLOW_EXPANSION_TYPE_ALIAS,
        (x) => x.entityType === entityType
      ),
      (expanders) => {
        this._expanders = expanders;
      }
    );
  }

  #observeWorkflowState() {
    this.observe(
      this.#workflowManager?.state,
      (state) => (this._state = state)
    );
  }

  async #flatMapExpanders() {
    const varies = this.#varies ? await this.#varies() : false;

    const datasetValue = (
      this._expanders?.flatMap((x) => x.meta.properties) ?? []
    ).filter(
      (x) => x.include?.({ state: this._state, varies }) ?? true
    ) as DatasetValueModel;

    return datasetValue;
  }

  async #buildDataset() {
    const datasetValue = await this.#flatMapExpanders();

    datasetValue.forEach((d) => {
      const dataPath = `$.values[${UmbDataPathPropertyValueQuery({
        alias: d.alias,
      })}].value`;

      d = { ...d, dataPath };
    });

    this._datasetValue = datasetValue.sort((a, b) =>
      (a.weight ?? 0) < (b.weight ?? 0) ? 1 : -1
    );
  }

  #requestSubmit() {
    this.validationContext.validate().then(
      () => this.#submit(),
      () => {}
    );
  }

  #submit() {
    const value = Object.fromEntries(
      this._datasetValue.map((item) => [item.alias, item.value])
    );

    const expanderAliases = this._expanders
      ?.flatMap((x) => x.meta.properties)
      .map((x) => x.alias);

    // Build a dictionary of expansion alias -> value (instead of array of single-property objects)
    const expansionValues = Object.fromEntries(
      this._datasetValue
        .filter((x) => expanderAliases?.includes(x.alias) && !x.core)
        .map((x) => [x.alias, x.value])
    );

    const initiateArgs = {
      ...this.getInitiatorArgs(value),
      expander: expansionValues,
      comment: value.comment as string,
    } as InitiateWorkflowArgs;

    this.#workflowManager?.initiate(initiateArgs);
    this._submitModal();
  }

  #onDatasetChange(e: Event) {
    const data = (e.target as UmbPropertyDatasetElement).value;

    this._datasetValue = this._datasetValue.map((d) => {
      const value = data?.find((x) => x.alias === d.alias)?.value;
      return value ? { ...d, value } : d;
    });
  }

  #getDatasetEntry(alias: string) {
    return this._datasetValue.find((x) => x.alias === alias);
  }

  #renderProperty(prop) {
    return html`<umb-property
      label=${prop.label}
      description=${ifDefined(prop.description)}
      alias=${prop.alias}
      property-editor-ui-alias=${prop.propertyEditorUiAlias}
      .config=${prop.config}
      .validation=${prop.validation}
      .dataPath=${prop.dataPath}
    ></umb-property>`;
  }

  render() {
    return html` <umb-body-layout
      .headline=${this.localize.term("workflow_approvalRequest")}
    >
      <uui-box>
        <umb-property-dataset
          .value=${this._datasetValue}
          @change=${this.#onDatasetChange}
        >
          ${this._datasetValue.map((d) => this.#renderProperty(d))}
        </umb-property-dataset>
        ${when(
          this.#getDatasetEntry("publishOn")?.value ||
            this.#getDatasetEntry("unpublishOn")?.value,
          () => html`
            <workflow-alert key="workflow_scheduleDescription">
            </workflow-alert>
          `
        )}
      </uui-box>

      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term(
            this.#getDatasetEntry("action")?.value === "Unpublish"
              ? "workflow_unpublishButton"
              : "workflow_publishButton"
          )}
          @click=${this.#requestSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }
}
