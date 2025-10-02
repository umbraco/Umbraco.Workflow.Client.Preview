import {
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { SectionRootBaseElement, SortDirection, type TableQueryModel } from "@umbraco-workflow/core";
import { InstanceService } from "@umbraco-workflow/generated";
import { InstanceFilters } from "@umbraco-workflow/components";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-history-root-workspace";

@customElement(elementName)
export class WorkflowHistoryRootWorkspaceElement extends SectionRootBaseElement {
  headline = this.localize.term("workflow_treeHeaders_history");

  @state()
  private _config: TableQueryModel = {
    handler: InstanceService.postInstanceAll,
    pageSize: 10,
    filterConfig: new InstanceFilters({ historyOnly: true }),
    direction: SortDirection.DESC,
  };

  #historyCleanupEnabled = false;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;

      this.#historyCleanupEnabled =
        context.getVariables()?.historyCleanupEnabled ?? false;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.#getFiltersFromStorage();
  }

  #getFiltersFromStorage() {
    // check local storage for filters - these are set on the workflow dashboard
    // when clicking a chart header card.
    const filterString = window.localStorage.getItem("workflow_historyFilter");
    if (!filterString) return;

    window.localStorage.removeItem("workflow_historyFilter");

    const filterValues = JSON.parse(filterString);
    const statusFilter = this._config.filterConfig?.filters.find(
      (f) => f.alias === "status"
    );

    if (statusFilter) {
      // status is a status name string, filter needs an int value
      const statusOption = statusFilter?.options?.find(
        (o) => o.name.toLowerCase() === filterValues.status.toLowerCase()
      );

      statusFilter!.value = [Number(statusOption?.value)];
    }

    const createdFilter = this._config.filterConfig?.filters.find(
      (f) => f.alias === "createdDate"
    );

    if (createdFilter) {
      createdFilter.value = { from: filterValues.from ?? null, to: null };
    }
  }

  renderSectionRoot() {
    return html`<workflow-table .config=${this._config}>
      <workflow-instances-table></workflow-instances-table>
      ${when(
        this.#historyCleanupEnabled,
        () => html` <workflow-history-cleanup></workflow-history-cleanup>`
      )}
    </workflow-table>`;
  }
}

export default WorkflowHistoryRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryRootWorkspaceElement;
  }
}
