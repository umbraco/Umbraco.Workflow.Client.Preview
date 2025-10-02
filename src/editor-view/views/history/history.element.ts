import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { SortDirection, type TableQueryModel } from "@umbraco-workflow/core";
import { InstanceService } from "@umbraco-workflow/generated";
import { InstanceFilters } from "@umbraco-workflow/components";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-workspace-history";

@customElement(elementName)
export class WorkflowWorkspaceHistoryElement extends UmbLitElement {
  @state()
  private _model!: TableQueryModel;

  #unique?: string | null;

  #historyCleanupEnabled = false;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;

      this.#historyCleanupEnabled =
        context.getVariables()?.historyCleanupEnabled ?? false;
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
      if (!instance) return;
      this.#unique = instance.getUnique()?.toString();
    });
  }

  async connectedCallback() {
    super.connectedCallback();

    this._model = {
      handler: InstanceService.postInstanceAll,
      filterConfig: new InstanceFilters(
        { historyOnly: true, unique: this.#unique },
        ["unique"]
      ),
      direction: SortDirection.DESC,
    };
  }

  render() {
    if (!this._model) return;

    return html`<workflow-table .config=${this._model}>
      <workflow-instances-table></workflow-instances-table>
      ${when(
        this.#historyCleanupEnabled,
        () => html` <workflow-history-cleanup
          .unique=${this.#unique}
        ></workflow-history-cleanup>`
      )}
    </workflow-table>`;
  }
}

export default WorkflowWorkspaceHistoryElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceHistoryElement;
  }
}
