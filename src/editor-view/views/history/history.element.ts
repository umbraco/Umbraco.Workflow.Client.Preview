import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import type { TableQueryModel } from "../../../types.js";
import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";
import { SortDirection } from "@umbraco-workflow/enums";
import { InstanceResource } from "@umbraco-workflow/generated";
import { InstanceFilters } from "@umbraco-workflow/components";
import type {
  FilterPickerElement,
  PageSizeDropdownElement,
  WorkflowFilterValueSet,
} from "@umbraco-workflow/components";

const elementName = "workflow-workspace-history";

@customElement(elementName)
export class WorkflowWorkspaceHistoryElement extends UmbElementMixin(
  LitElement
) {
  @state()
  model!: TableQueryModel;

  #perPage = 5;
  #init: Promise<unknown>;
  #unique?: string;
  #nodeName?: string;
  #contentTypeUnique?: string;

  filters?: WorkflowFilterValueSet;
  #filterConfig = new InstanceFilters(undefined, ["nodeId"]);

  constructor() {
    super();

    this.#init = Promise.all([
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
        if (!instance) return;
        this.#unique = instance.getUnique();
        this.#contentTypeUnique = instance.getContentTypeId();
        this.#nodeName = instance.getName();
      }).asPromise(),
    ]);
  }

  async connectedCallback() {
    super.connectedCallback();

    await this.#init;
    this.#fetch();
  }

  #fetch(event?: CustomEvent) {
    this.#perPage =
      (event?.target as PageSizeDropdownElement)?.value ?? this.#perPage;

    this.model = {
      page: 1,
      count: this.#perPage,
      handler: InstanceResource.postInstanceAll,
      filters: this.filters,
      direction: SortDirection.DESC,
      meta: {
        historyOnly: true,
        nodeId: this.#unique,
      },
    };
  }

  #handleFilterChange(event: CustomEvent) {
    const filters = (event.target as FilterPickerElement).value;
    if (!filters) return;

    this.filters = filters;
    this.#fetch();
  }

  render() {
    return html`<uui-box>
      <div slot="header-actions">
        <workflow-filter-picker
          @change=${this.#handleFilterChange}
          .config=${this.#filterConfig}
        >
        </workflow-filter-picker>
        <workflow-page-size
          @change=${this.#fetch}
          .value=${this.#perPage}
        ></workflow-page-size>
      </div>
      <workflow-instances-table .model=${this.model}></workflow-instances-table>
      <workflow-history-cleanup
        .unique=${this.#unique}
        .nodeName=${this.#nodeName}
        .contentTypeUnique=${this.#contentTypeUnique}
      ></workflow-history-cleanup>
    </uui-box>`;
  }

  static styles = [BoxHeaderFlexStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceHistoryElement;
  }
}
