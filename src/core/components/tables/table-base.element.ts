import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import type { UUIPaginationEvent } from "@umbraco-ui/uui-pagination";
import {
  html,
  nothing,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPaginationManager } from "@umbraco-cms/backoffice/utils";
import { UMB_APP_LANGUAGE_CONTEXT ,type  UmbLanguageDetailModel  } from "@umbraco-cms/backoffice/language";
import { Sorter } from "./sorter.js";
import { type TableQueryModel, SortDirection } from "@umbraco-workflow/core";
import type {
  WorkflowSearchRequestModel,
} from "@umbraco-workflow/generated";

export abstract class WorkflowTableBaseElement extends UmbLitElement {
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

  @state()
  loading = true;

  pagination = new UmbPaginationManager();

  tableConfig: UmbTableConfig = {
    allowSelection: false,
  };

  tableColumns: Array<UmbTableColumn> = [];
  availableLanguages: Array<UmbLanguageDetailModel> = [];

  abstract map(result: any): Array<UmbTableItem>;
  abstract buildTable(): void;

  constructor() {
    super();

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (instance) => {
      if (!instance) return;

      this.observe(instance.languages, (languages) => {
        this.availableLanguages = languages;
        this.buildTable();
      });
    });
  }

  setTableColumns() {
    this.tableColumns = this.tableColumns.filter(
      (c) => !this.model?.hiddenColumns?.includes(c.alias)
    );
  }

  protected async doFetch() {
    if (!this.model) return;

    this.loading = true;

    this.setTableColumns();
    this.sorter.setDirection(this.model.direction ?? SortDirection.ASC);
    this.pagination.setPageSize(this.model.pageSize ?? 5);

    const body: WorkflowSearchRequestModel = {
      skip: this.pagination.getSkip(),
      take: this.pagination.getPageSize(),
      sortBy: this.sorter.sortBy,
      sortDirection: this.sorter.sortDirectionString,
      filters: this.model.filters ?? {},
    };

    const { data } = await this.model.handler({
      body: { ...body, ...this.model.meta },
    });

    this.tableItems = this.map(data);
    this.pagination.setTotalItems(data.totalItems);

    this.loading = false;
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
      style="display:block; margin-top: var(--uui-size-5)"
      .total=${this.pagination.getTotalPages()}
      .current=${this.pagination.getCurrentPageNumber()}
      @change=${this.#onPageChange}
    ></uui-pagination>`;
  }

  #renderTable() {
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

  render() {
    return when(
      this.loading,
      () => html`<uui-loader-bar></uui-loader-bar>`,
      () => this.#renderTable()
    );
  }
}
