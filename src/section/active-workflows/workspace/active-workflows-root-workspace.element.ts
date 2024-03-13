import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { TableQueryModel } from "../../../types.js";
import { SectionRootBase } from "../../section-root.base.element.js";
import { InstanceResource } from "@umbraco-workflow/generated";
import type {
  FilterPickerElement,
  PageSizeDropdownElement,
  WorkflowFilterValueSet} from "@umbraco-workflow/components";
import {
  InstanceFilters
} from "@umbraco-workflow/components";
import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "active-workflows-root-workspace";

@customElement(elementName)
export class ActiveWorkflowsRootWorkspaceElement extends SectionRootBase {
  perPage = 10;

  @state()
  model!: TableQueryModel;

  headline = this.localize.term("treeHeaders_active");

  filters?: WorkflowFilterValueSet;
  #filterConfig = new InstanceFilters(undefined, ["status", "completedDate"]);  

  #meta?: {
    userId: string,
    isAdmin: boolean,
  }

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.observe(instance.globalVariables, (variables) => {
        this.#meta = {
          isAdmin: variables?.currentUserIsAdmin ?? false,
          userId: variables?.currentUserUnique ?? "",
        }
        this.#fetch();
      });
    });
  }

  #fetch(event?: CustomEvent) {
    if (!this.#meta?.userId) return;
    
    this.perPage =
      (event?.target as PageSizeDropdownElement)?.value ?? this.perPage;

    this.model = {
      count: this.perPage,
      filters: this.filters,
      page: 1,
      handler: InstanceResource.postInstanceActive,
      meta: this.#meta,
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
        <workflow-filter-picker @change=${this.#handleFilterChange} .config=${this.#filterConfig}>
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
