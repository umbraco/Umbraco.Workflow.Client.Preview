import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { InstanceService } from "@umbraco-workflow/generated";
import {
  SectionRootBaseElement,
  WorkflowDetailModalRouterController,
  type TableQueryModel,
} from "@umbraco-workflow/core";
import { InstanceFilters } from "@umbraco-workflow/components";

const elementName = "active-workflows-root-workspace";

@customElement(elementName)
export class ActiveWorkflowsRootWorkspaceElement extends SectionRootBaseElement {
  headline = this.localize.term("workflow_treeHeaders_active");

  constructor() {
    super();
    new WorkflowDetailModalRouterController(this);
  }

  @state()
  _config: TableQueryModel = {
    handler: InstanceService.postInstanceActive,
    filterConfig: new InstanceFilters(undefined, ["status", "completedDate"]),
  };

  renderSectionRoot() {
    return html`
      <workflow-table .config=${this._config}>
        <workflow-instances-table></workflow-instances-table>
      </workflow-table>
    `;
  }
}

export default ActiveWorkflowsRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ActiveWorkflowsRootWorkspaceElement;
  }
}
