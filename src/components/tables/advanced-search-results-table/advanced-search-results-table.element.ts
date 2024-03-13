import type { UmbTableItem } from "@umbraco-cms/backoffice/components";
import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowTableBase } from "../table-base.element.js";
import type { WorkflowTable } from "../workflow-table.js";
import type {
  AdvancedSearchResponseItemModel,
  AdvancedSearchResponseModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-advanced-search-results-table";

@customElement(elementName)
export class AdvancedSearchResultsTableElement
  extends WorkflowTableBase
  implements WorkflowTable
{
  connectedCallback() {
    super.connectedCallback();
    this.buildTable();
  }

  buildTable() {
    const columns = [
      {
        name: this.localize.term("general_name"),
        alias: "name",
        // elementName: this should be an element opening the content in an overlay
      },
      {
        name: this.localize.term("mediaPicker_trashed"),
        alias: "trashed",
      },
      {
        name: this.localize.term("workflowSearch_score"),
        alias: "score",
      },
    ];

    this.setTableColumns(columns);
  }

  async doFetch() {
    const requestBody = {
      ...this.model?.meta!.requestBody,
      skip: this.pagination.skip,
      take: this.pagination.take,
    };

    const handlerResult = await this.model?.handler({ requestBody });
    this.tableItems = this.map(handlerResult);
    this.pagination.totalItems = handlerResult.totalItems;
  }

  map(result: AdvancedSearchResponseModel): Array<UmbTableItem> {
    if (result.totalItems === 0 || !result.results) {
      return [];
    }

    return (result?.results ?? []).map(
      (r: AdvancedSearchResponseItemModel) => ({
        id: r.key!,
        icon: r.icon ?? "document",
        data: [
          {
            columnAlias: "name",
            value: r.name,
          },
          {
            columnAlias: "trashed",
            value: r.trashed,
          },
          {
            columnAlias: "score",
            value: r.score,
          },
        ],
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AdvancedSearchResultsTableElement;
  }
}
