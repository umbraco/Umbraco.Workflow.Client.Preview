import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowApprovalGroupWorkspaceViewBase } from "./approval-group-workspace-view-base.element.js";
import type {
  TableQueryModel,
  WorkflowInstancesFilterModel,
} from "@umbraco-workflow/types";
import type { FilterModel} from "@umbraco-workflow/generated";
import { InstanceService } from "@umbraco-workflow/generated";
import { SortDirection } from "@umbraco-workflow/enums";
import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";
import type { FilterPickerElement } from "@umbraco-workflow/components";
import { InstanceFilters } from "@umbraco-workflow/components";

const elementName = "workflow-approval-group-members-workspace-view";

@customElement(elementName)
export class ApprovalGroupMembersWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  perPage = 10;

  @state()
  model!: TableQueryModel;

  activityFilter!: WorkflowInstancesFilterModel;

  filters?: FilterModel;
  #filterConfig = new InstanceFilters();

  async connectedCallback() {
    super.connectedCallback();
    await this.init;
    this.#fetch();
  }

  #fetch(perPage = this.perPage) {
    this.perPage = perPage;

    this.model = {
      page: 1,
      count: this.perPage,
      filters: this.filters,
      handler: InstanceService.postInstanceAll,
      direction: SortDirection.DESC,
      meta: {
        groupId: this._group?.unique,
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
          .value=${this.perPage}
        ></workflow-page-size>
      </div>
      <workflow-instances-table .model=${this.model}></workflow-instances-table>
    </uui-box>`;
  }

  static styles = [
    BoxHeaderFlexStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }
    `,
  ];
}

export default ApprovalGroupMembersWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupMembersWorkspaceViewElement;
  }
}
