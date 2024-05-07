import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { SectionRootBase } from "../../section-root.base.element.js";
import { SortDirection, type TableQueryModel } from "@umbraco-workflow/core";

import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";
import { InstanceService, type FilterModel } from "@umbraco-workflow/generated";

import {
  InstanceFilters,
  type FilterPickerElement,
  type PageSizeDropdownElement,
} from "@umbraco-workflow/components";

const elementName = "workflow-history-root-workspace";

@customElement(elementName)
export class WorkflowHistoryRootWorkspaceElement extends SectionRootBase {
  perPage = 10;

  @state()
  model!: TableQueryModel;

  headline = this.localize.term("treeHeaders_history");

  filters?: FilterModel;
  filterConfig = new InstanceFilters();

  connectedCallback() {
    super.connectedCallback();
    this.#fetch();
  }

  #handleFilterChange(event: CustomEvent) {
    const filters = (event.target as FilterPickerElement).value;
    if (!filters) return;

    this.filters = filters;
    this.#fetch();
  }

  #fetch(event?: CustomEvent) {
    this.perPage =
      (event?.target as PageSizeDropdownElement)?.value ?? this.perPage;

    this.model = {
      page: 1,
      count: this.perPage,
      filters: { ...this.filters, ...{ historyOnly: true } },
      handler: InstanceService.postInstanceAll,
      direction: SortDirection.DESC,
    };
  }

  renderSectionRoot() {
    return html`<uui-box>
      <div slot="header-actions">
        <workflow-filter-picker
          @change=${this.#handleFilterChange}
          .config=${this.filterConfig}
        >
        </workflow-filter-picker>
        <workflow-page-size
          @change=${this.#fetch}
          .value=${this.perPage}
        ></workflow-page-size>
      </div>
      <workflow-instances-table .model=${this.model}></workflow-instances-table>
      <workflow-history-cleanup></workflow-history-cleanup>
    </uui-box>`;
  }

  static styles = [BoxHeaderFlexStyles];
}

export default WorkflowHistoryRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryRootWorkspaceElement;
  }
}
