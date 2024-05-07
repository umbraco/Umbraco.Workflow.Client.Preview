import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import type { UUIPaginationEvent } from "@umbraco-ui/uui-pagination";
import type { PropertyValueMap } from "@umbraco-cms/backoffice/external/lit";
import {
  LitElement,
  html,
  nothing,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { Sorter } from "../sorter.js";
import type { TableQueryModel } from "../../core/entities.js";
import { Pagination } from "./pagination.js";
import type {
  LanguageModel,
  WorkflowSearchRequestModel,
} from "@umbraco-workflow/generated";
import { SortDirection } from "src/core/enums.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export abstract class WorkflowTableBase extends UmbElementMixin(LitElement) {

  @property({ type: Object })
  model?: TableQueryModel;

  @state()
  tableItems: Array<UmbTableItem> = [];

  @state()
  pagination = new Pagination(() => this.doFetch());

  @state()
  sorter = new Sorter(() => this.doFetch());

  tableConfig: UmbTableConfig = {
    allowSelection: false,
  };

  tableColumns: Array<UmbTableColumn> = [];
  availableLanguages: Array<LanguageModel> = [];

  connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;

      this.observe(instance.globalVariables, (variables) => {
        this.availableLanguages = variables?.availableLanguages ?? [];
      });
    });
  }

  updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log('updated', _changedProperties);
    if (_changedProperties.get("model")) {
      this.doFetch();
    }
  }

  setTableColumns(columns: Array<UmbTableColumn>) {
    this.tableColumns = columns.filter(
      (c) => !this.model?.hiddenColumns?.includes(c.alias)
    );
  }

  async doFetch() {
    if (!this.model) return;

    this.sorter.setDirection(
      this.model.direction === "down" ? SortDirection.DESC : SortDirection.ASC
    );

    this.pagination.take = this.model.count;

    const query: WorkflowSearchRequestModel = {
      skip: this.pagination.skip,
      take: this.pagination.take,
      sortBy: this.sorter.sortBy,
      sortDirection: this.sorter.sortDirectionString,
      filters: this.model.filters ?? {},
    };

    // TODO => get rid of meta
    Object.assign(query, this.model.meta);

    const handlerResult = await this.model.handler({ requestBody: query });
    this.tableItems = this.map(handlerResult);
    this.pagination.totalItems = handlerResult.totalItems;
  }

  /**
   * If the comment has an error appended, split it off
   * @param item
   * @returns
   */
  getComment(item: any) {
    const comment = (item.instance?.comment || item.comment || "").split(
      " ["
    )[0];
    const trimmedComment = comment.substring(0, 140);

    return `${trimmedComment}${comment.length > 140 ? "..." : ""}`;
  }

  map(result: any): Array<UmbTableItem> {
    return [];
  }

  sort(key: string) {
    this.sorter.update(key);
  }

  renderPagination() {
    if (this.pagination.totalPages < 2) {
      return nothing;
    }

    return html`<uui-pagination
      .total=${this.pagination.totalPages}
      .current=${this.pagination.current}
      @change=${(e: UUIPaginationEvent) =>
        this.pagination.change(e.target.current)}
    ></uui-pagination>`;
  }

  render() {
    return when(
      this.tableItems.length,
      () => html`<umb-table
          .config=${this.tableConfig}
          .columns=${this.tableColumns}
          .items=${this.tableItems}
        ></umb-table>

        ${this.renderPagination()}`,
      () => this.localize.term("content_noItemsToShow")
    );
  }
}
