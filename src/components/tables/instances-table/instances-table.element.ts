import type { UmbTableItem } from "@umbraco-cms/backoffice/components";
import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowTimelineTableBase } from "../timeline-table-base.element.js";
import type { WorkflowTable } from "../workflow-table.js";
import type {
  PagedWorkflowInstanceResponseModel,
  WorkflowInstanceResponseModel,
} from "@umbraco-workflow/generated";

import "../base-table-detail-column-layout.element.js";
import "../base-table-name-column-layout.element.js";
import "../timeline-table-progress-column-layout.element.js";

const elementName = "workflow-instances-table";

@customElement(elementName)
export class WorkflowInstancesTableElement extends WorkflowTimelineTableBase implements WorkflowTable {
  connectedCallback() {
    super.connectedCallback();
    this.buildTable();
  }

  buildTable() {
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
        name: this.localize.term("content_type"),
        alias: "type",
      },
      {
        name: this.localize.term("workflow_requestedBy"),
        alias: "requestedBy",
      },
      {
        name: this.localize.term("workflow_requestedOn"),
        alias: "requestedOn",
      },
      {
        name: this.localize.term("general_comment"),
        alias: "comment",
      },
      {
        name: "",
        alias: "detail",
        elementName: "base-table-detail-column-layout",
      },
      {
        name: "",
        alias: "progress",
        elementName: "timeline-table-progress-column-layout",
      },
    ];

    this.setTableColumns(columns);
  }

  map(result: PagedWorkflowInstanceResponseModel): Array<UmbTableItem> {
    if (result.totalItems === 0 || !result.items) {
      return [];
    }

    return result.items.map((item: WorkflowInstanceResponseModel) => {
      if (!item.instance?.key) throw new Error("instance key is missing");

      return {
        id: item.instance.key,
        icon: item.node?.icon ?? "document",
        data: [
          {
            columnAlias: "page",
            value: {
              languages: this.availableLanguages,
              nodeName: item.node?.name,
              nodeKey: item.node?.key,
              variantCode: item.instance?.variantCode,
              defaultCulture: result.defaultCulture,
            },
          },
          {
            columnAlias: "type",
            value: this.localize.term(
              `actions_${item.instance?.type?.toLowerCase()}`
            ),
          },
          {
            columnAlias: "requestedBy",
            value: item.instance?.requestedBy,
          },
          {
            columnAlias: "requestedOn",
            value: this.localize.date(item.instance?.requestedOn ?? "-"),
          },
          {
            columnAlias: "comment",
            value: item.instance?.comment,
          },
          {
            columnAlias: "detail",
            value: item,
          },
          {
            columnAlias: "progress",
            value: item,
          },
        ],
      };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowInstancesTableElement;
  }
}
