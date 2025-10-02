import type { UmbTableItem } from "@umbraco-cms/backoffice/components";
import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowTableBaseElement, type WorkflowTable } from "@umbraco-workflow/core";
import type {
  ContentReviewCollectionResponseModel,
  PagedContentReviewCollectionResponseModel,
} from "@umbraco-workflow/generated";

import "./content-reviews-table-groups-column-layout.element.js";
import "../../../core/components/tables/elements/base-table-date-column-layout.element.js";

const elementName = "content-reviews-table";

@customElement(elementName)
export class ContentReviewsTableElement
  extends WorkflowTableBaseElement
  implements WorkflowTable
{
  buildTable() {
    this.sorter.setSortBy("dueOn");
    this.tableColumns = [
      {
        name: `${this.localize.term("headers_page")} ${
          this.availableLanguages.length > 1
            ? `(${this.localize.term("general_language")})`
            : ""
        }`,
        alias: "page",
        elementName: "base-table-name-column-layout",
      },
      {
        name: this.localize.term("contentReviews_nextReviewDue"),
        alias: "dueOn",
        elementName: "base-table-date-column-layout",
      },
      {
        name: this.localize.term("contentReviews_lastReviewed"),
        alias: "lastReviewed",
        elementName: "base-table-date-column-layout",
      },
      {
        name: this.localize.term("contentReviews_reviewPeriod"),
        alias: "reviewPeriod",
      },
      {
        name: this.localize.term("contentReviews_reviewGroup"),
        alias: "reviewGroup",
        elementName: "content-reviews-table-group-column-layout",
      },
    ];
  }

  map(result: PagedContentReviewCollectionResponseModel): Array<UmbTableItem> {
    if (result.totalItems === 0 || !result.items) {
      return [];
    }

    return result.items.map((item: ContentReviewCollectionResponseModel) => {
      return {
        id: item.document!.unique!,
        icon: item.document?.icon ?? "document",
        data: [
          {
            columnAlias: "page",
            value: item.document,
          },
          { columnAlias: "dueOn", value: item.dueOn },
          {
            columnAlias: "lastReviewed",
            value: item.lastReviewed,
          },
          { columnAlias: "reviewPeriod", value: item.reviewPeriod },
          {
            columnAlias: "reviewGroup",
            value: item.groups,
          },
        ],
      };
    });
  }
}

export default ContentReviewsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsTableElement;
  }
}
