import {
  UmbTableOrderedEvent,
  type UmbTableColumn,
  type UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import {
  css,
  html,
  ifDefined,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowTableBase } from "./table-base.element.js";

import { TIMELINE_TABLE_PROGRESS_COLUMN_LAYOUT } from "./timeline-table-progress-column-layout.element.js";

export class WorkflowTimelineTableBase extends WorkflowTableBase {
  @property({ type: String, attribute: false })
  public orderingColumn = "";

  @property({ type: Boolean, attribute: false })
  public orderingDesc = false;

  #progressColumn?: UmbTableColumn;

  setTableColumns(columns: Array<UmbTableColumn>) {
    this.tableColumns = columns.filter(
      (c) => !this.model?.hiddenColumns?.includes(c.alias)
    );

    this.#progressColumn = this.tableColumns.find(
      (x) => x.elementName === TIMELINE_TABLE_PROGRESS_COLUMN_LAYOUT
    );
  }

  #handleOrderingChange(column: UmbTableColumn) {
    this.orderingDesc =
      this.orderingColumn === column.alias ? !this.orderingDesc : false;
    this.orderingColumn = column.alias;
    this.dispatchEvent(new UmbTableOrderedEvent());
  }

  #renderHeaderCell(column: UmbTableColumn) {
    if (column.elementName === TIMELINE_TABLE_PROGRESS_COLUMN_LAYOUT)
      return null;

    return html`
      <uui-table-head-cell
        style="--uui-table-cell-padding: 0 var(--uui-size-5)"
      >
        ${column.allowSorting
          ? html`${this.#renderSortingUI(column)}`
          : column.name}
      </uui-table-head-cell>
    `;
  }

  #renderSortingUI(column: UmbTableColumn) {
    return html`
      <button
        style="padding: var(--uui-size-4) var(--uui-size-5);"
        @click="${() => this.#handleOrderingChange(column)}"
      >
        ${column.name}
        <uui-symbol-sort
          ?active=${this.orderingColumn === column.alias}
          ?descending=${this.orderingDesc}
        >
        </uui-symbol-sort>
      </button>
    `;
  }

  #renderRow(item: UmbTableItem) {
    return html`<uui-table-row ?selectable=${false}>
      <uui-table-cell
        ><uui-icon name=${ifDefined(item.icon ?? undefined)}></uui-icon
      ></uui-table-cell>
      ${this.tableColumns.map((column) => this.#renderRowCell(column, item))}
      ${when(this.#progressColumn !== undefined, () =>
        this.#renderCellContent(this.#progressColumn!, item)
      )}
    </uui-table-row>`;
  }

  #renderRowCell(column: UmbTableColumn, item: UmbTableItem) {
    if (column.elementName === TIMELINE_TABLE_PROGRESS_COLUMN_LAYOUT)
      return null;

    return html`<uui-table-cell style="--uui-table-cell-padding: 0 var(--uui-size-5); width: ${
      column.width || "auto"
    }"
			>${this.#renderCellContent(column, item)}</uui-table-cell>
		</uui-table-cell>`;
  }

  #renderCellContent(column: UmbTableColumn, item: UmbTableItem) {
    const value = item.data.find(
      (data) => data.columnAlias === column.alias
    )?.value;

    if (column.elementName) {
      const element = document.createElement(column.elementName) as any;
      element.column = column;
      element.item = item;
      element.value = value;
      return element;
    }

    return value;
  }

  render() {
    return when(
      this.tableItems.length,
      () => html` <uui-table>
          <uui-table-column style="width: 60px;"></uui-table-column>

          <uui-table-head>
            <uui-table-head-cell
              style="--uui-table-cell-padding: 0"
            ></uui-table-head-cell>
            ${this.tableColumns.map((column) => this.#renderHeaderCell(column))}
          </uui-table-head>
          ${this.tableItems.map((item) => this.#renderRow(item))}
        </uui-table>

        ${this.renderPagination()}`,
      () => this.localize.term("content_noItemsToShow")
    );
  }

  static styles = [
    css`
      uui-table {
        box-shadow: var(--uui-shadow-depth-1);
      }

      uui-pagination {
        margin-top: var(--uui-size-space-5);
        display: block;
      }

      uui-table-head {
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
        background-color: var(--uui-color-surface);
      }

      uui-table:has(timeline-table-progress-column-layout) uui-table-cell {
        padding-bottom: 20px;
      }

      uui-table:has(timeline-table-progress-column-layout) uui-icon {
        transform: translateY(-50%);
      }

      timeline-table-progress-column-layout {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 30px;
        z-index: 1;
      }
    `,
  ];
}
