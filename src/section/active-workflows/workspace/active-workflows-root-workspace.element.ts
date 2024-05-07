import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { TableQueryModel } from "../../../core/entities.js";
import { SectionRootBase } from "../../section-root.base.element.js";
import type { FilterModel } from "@umbraco-workflow/generated";
import { InstanceService } from "@umbraco-workflow/generated";
import type {
  FilterPickerElement,
  PageSizeDropdownElement,
} from "@umbraco-workflow/components";
import { InstanceFilters } from "@umbraco-workflow/components";
import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "active-workflows-root-workspace";

@customElement(elementName)
export class ActiveWorkflowsRootWorkspaceElement extends SectionRootBase {
  perPage = 10;

  @state()
  model!: TableQueryModel;

  headline = this.localize.term("treeHeaders_active");

  filters?: FilterModel;
  #filterConfig = new InstanceFilters(undefined, ["status", "completedDate"]);

  constructor() {
    super();
    this.#fetch();
  }

  #fetch(event?: CustomEvent) {
    this.perPage =
      (event?.target as PageSizeDropdownElement)?.value ?? this.perPage;

    this.model = {
      count: this.perPage,
      filters: this.filters,
      page: 1,
      handler: InstanceService.postInstanceActive,
    };
  }

  #handleFilterChange(event: CustomEvent) {
    const filters = (event.target as FilterPickerElement).value;
    if (!filters) return;

    this.filters = filters;
    this.#fetch();
  }

  renderSectionRoot() {
    return html`<uui-box>
      <div slot="header-actions">
        <workflow-filter-picker
          @change=${this.#handleFilterChange}
          .config=${this.#filterConfig}
        >
        </workflow-filter-picker>
        <workflow-page-size
          @change=${this.#fetch}
          .value=${this.perPage}
        ></workflow-page-size>
      </div>
      <workflow-instances-table .model=${this.model}></workflow-instances-table>
    </uui-box>`;
  }

  static styles = [BoxHeaderFlexStyles];
}

export default ActiveWorkflowsRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ActiveWorkflowsRootWorkspaceElement;
  }
}
