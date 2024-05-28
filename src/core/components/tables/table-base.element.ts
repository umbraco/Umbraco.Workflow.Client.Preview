import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import type { UUIPaginationEvent } from "@umbraco-ui/uui-pagination";
import {
  LitElement,
  html,
  nothing,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPaginationManager } from "@umbraco-cms/backoffice/utils";
import { Sorter } from "./sorter.js";
import { type TableQueryModel, SortDirection } from "@umbraco-workflow/core";
import type {
  LanguageModel,
  WorkflowSearchRequestModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export abstract class WorkflowTableBase extends UmbElementMixin(LitElement) {
  @property({ type: Object })
  set model(value: TableQueryModel) {
    this.#model = value;
    this.doFetch();
  }

  get model() {
    return this.#model;
  }

  #model!: TableQueryModel;

  @state()
  tableItems: Array<UmbTableItem> = [];

  @state()
  sorter = new Sorter(() => this.doFetch());

  pagination = new UmbPaginationManager();

  tableConfig: UmbTableConfig = {
    allowSelection: false,
  };

  tableColumns: Array<UmbTableColumn> = [];
  availableLanguages: Array<LanguageModel> = [];

  abstract map(result: any): Array<UmbTableItem>;
  abstract buildTable(): void;

  connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;

      this.observe(instance.globalVariables, (variables) => {
        this.availableLanguages = variables?.availableLanguages ?? [];
        this.buildTable();
      });
    });
  }

  setTableColumns(columns: Array<UmbTableColumn>) {
    this.tableColumns = columns.filter(
      (c) => !this.model?.hiddenColumns?.includes(c.alias)
    );
  }

  protected async doFetch() {
    if (!this.model) return;

    this.sorter.setDirection(
      this.model.direction === "down" ? SortDirection.DESC : SortDirection.ASC
    );

    this.pagination.setPageSize(this.model.count ?? 5);

    const requestBody: WorkflowSearchRequestModel = {
      skip: this.pagination.getSkip(),
      take: this.pagination.getPageSize(),
      sortBy: this.sorter.sortBy,
      sortDirection: this.sorter.sortDirectionString,
      filters: this.model.filters ?? {},
    };

    // TODO => get rid of meta?
    Object.assign(requestBody, this.model.meta);

    const handlerResult = await this.model.handler({ requestBody });
    this.tableItems = this.map(handlerResult);
    this.pagination.setTotalItems(handlerResult.totalItems);
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

  sort(key: string) {
    this.sorter.update(key);
  }

  #onPageChange(e: UUIPaginationEvent) {
    this.pagination.setCurrentPageNumber(e.target.current);
    this.doFetch();
  }

  renderPagination() {
    if (this.pagination.getTotalPages() < 2) {
      return nothing;
    }

    return html`<uui-pagination
      .total=${this.pagination.getTotalPages()}
      .current=${this.pagination.getCurrentPageNumber()}
      @change=${this.#onPageChange}
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
