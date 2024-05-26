import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { type TableQueryModel } from "@umbraco-workflow/core";
import { InstanceService } from "@umbraco-workflow/generated";
import { InstanceFilters } from "@umbraco-workflow/components";

const elementName = "workflow-workspace-history";

@customElement(elementName)
export class WorkflowWorkspaceHistoryElement extends UmbElementMixin(
  LitElement
) {

  @state()
  private _model!: TableQueryModel;

  #init: Promise<unknown>;
  #unique?: string;

  constructor() {
    super();

    this.#init = Promise.all([
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
        if (!instance) return;
        this.#unique = instance.getUnique();
      }).asPromise(),
    ]);
  }

  async connectedCallback() {
    super.connectedCallback();

    await this.#init;

    this._model = {
      handler: InstanceService.postInstanceAll,
      filterConfig: new InstanceFilters(
        { historyOnly: true, unique: this.#unique },
        ["unique"]
      ),
    };
  }

  render() {
    if (!this._model) return;

    return html`<workflow-table .config=${this._model}>
      <workflow-instances-table></workflow-instances-table>
      <workflow-history-cleanup
        .unique=${this.#unique}
      ></workflow-history-cleanup>
    </workflow-table>`;
  }
}

export default WorkflowWorkspaceHistoryElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceHistoryElement;
  }
}
