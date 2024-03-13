import type { UmbTableItem } from "@umbraco-cms/backoffice/components";
import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowTableBase } from "../table-base.element.js";
import type { WorkflowTable } from "../workflow-table.js";
import type {
  ContentReviewsDetailedConfigModel,
  PagedContentReviewsDetailedConfigModel,
} from "@umbraco-workflow/generated";

import "../base-table-detail-column-layout.element.js";
import "./content-reviews-table-groups-column-layout.element.js";

const elementName = "content-reviews-table";

@customElement(elementName)
export class ContentReviewsTableElement extends WorkflowTableBase implements WorkflowTable {

  connectedCallback() {
    super.connectedCallback();
    this.buildTable();
  }

  buildTable() {
    this.sorter.setSortBy("dueOn");
    const columns = [
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
      },
      {
        name: this.localize.term("contentReviews_lastReviewed"),
        alias: "lastReviewed",
      },
      {
        name: this.localize.term("contentReviews_reviewPeriod"),
        alias: "reviewPeriod",
      },
      {
        name: this.localize.term("contentReviews_reviewGroup"),
        alias: "reviewGroup",
        elementName: "content-reviews-table-groups-column-layout",
      },
    ];

    this.setTableColumns(columns);
  }

  map(result: PagedContentReviewsDetailedConfigModel): Array<UmbTableItem> {
    if (result.totalItems === 0 || !result.items) {
      return [];
    }

    return result.items.map((item: ContentReviewsDetailedConfigModel) => {
      return {
        id: item.id!.toString(),
        icon: item.icon ?? "document",
        data: [
          {
            columnAlias: "page",
            value: {
              languageCount: this.availableLanguages.length,
              nodeName: item.name,
              nodeKey: item.documentKey,
              variantName: item.variantName,
              variantCode: item.variant,
              defaultCulture: result.defaultCulture,
            },
          },
          { columnAlias: "dueOn", value: this.localize.date(item.dueOn!) },
          { columnAlias: "lastReviewed", value: this.localize.date(item.reviewedOn!) },
          { columnAlias: "reviewPeriod", value: item.period },
          {
            columnAlias: "reviewGroup",
            value: item.groups,
          },
        ],
      };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsTableElement;
  }
}
