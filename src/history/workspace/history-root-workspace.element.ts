import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { SectionRootBase, type TableQueryModel } from "@umbraco-workflow/core";
import { InstanceService } from "@umbraco-workflow/generated";
import { InstanceFilters } from "@umbraco-workflow/components";

const elementName = "workflow-history-root-workspace";

@customElement(elementName)
export class WorkflowHistoryRootWorkspaceElement extends SectionRootBase {
  headline = this.localize.term("treeHeaders_history");

  #config: TableQueryModel = {
    handler: InstanceService.postInstanceAll,
    count: 10,
    filterConfig: new InstanceFilters({ historyOnly: true }),
  };

  renderSectionRoot() {
    return html`<workflow-table .config=${this.#config}>
      <workflow-instances-table></workflow-instances-table>
      <workflow-history-cleanup></workflow-history-cleanup>
    </workflow-table>`;
  }
}

export default WorkflowHistoryRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryRootWorkspaceElement;
  }
}
