import type { UmbTableItem } from "@umbraco-cms/backoffice/components";
import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowTimelineTableBase } from "../timeline-table/timeline-table-base.element.js";
import type { WorkflowTable } from "../workflow-table.interface.js";
import {
  WorkflowStatusModel,
  type PagedWorkflowInstanceTableResponseModel,
  type WorkflowInstanceTableResponseModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_SIGNALR_CONTEXT } from "@umbraco-workflow/context";
import { getCommentParts } from "@umbraco-workflow/core";

import "./instances-table-detail-column-layout.element.js";
import "./instances-table-status-column-layout.element.js";
import "../elements/base-table-name-column-layout.element.js";
import "../elements/base-table-date-column-layout.element.js";
import "../timeline-table/timeline-table-progress-column-layout.element.js";

const elementName = "workflow-instances-table";

@customElement(elementName)
export class WorkflowInstancesTableElement
  extends WorkflowTimelineTableBase
  implements WorkflowTable
{
  constructor() {
    super();

    this.consumeContext(WORKFLOW_SIGNALR_CONTEXT, (context) => {
      this.observe(context?.refresh, () => this.doFetch());
    });
  }

  buildTable() {
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
        name: this.localize.term("content_type"),
        alias: "action",
      },
      {
        name: this.localize.term("workflow_requestedBy"),
        alias: "requestedBy",
      },
      {
        name: this.localize.term("workflow_requestedOn"),
        alias: "requestedOn",
        elementName: "base-table-date-column-layout",
      },
      {
        name: this.localize.term("general_comment"),
        alias: "comment",
      },
      {
        name: this.localize.term("general_status"),
        alias: "status",
        elementName: "instances-table-status-column-layout",
      },
      {
        name: "",
        alias: "detail",
        elementName: "instances-table-detail-column-layout",
      },
      {
        name: "",
        alias: "progress",
        elementName: "timeline-table-progress-column-layout",
      },
    ];
  }

  map(result: PagedWorkflowInstanceTableResponseModel): Array<UmbTableItem> {
    if (result.totalItems === 0 || !result.items) {
      return [];
    }

    const actionFormatter = (item: WorkflowInstanceTableResponseModel) => {
      if (!item.scheduled)
        return this.localize.term(`actions_${item.action?.toLowerCase()}`);

      return `${this.localize.term(`workflow_scheduled`)} ${this.localize
        .term(`actions_${item.action?.toLowerCase()}`)
        .toLowerCase()}`;
    };

    return result.items.map((item: WorkflowInstanceTableResponseModel) => {
      if (!item.unique) throw new Error("unique is missing");

      return {
        id: item.unique,
        icon:
          (item.status as WorkflowStatusModel) === WorkflowStatusModel.ERRORED
            ? "alert var(--workflow-errored)"
            : item.document?.icon ?? "document",
        data: [
          {
            columnAlias: "page",
            value: item.document,
          },
          {
            columnAlias: "action",
            value: actionFormatter(item),
          },
          {
            columnAlias: "requestedBy",
            value: item.requestedBy,
          },
          {
            columnAlias: "requestedOn",
            value: item.requestedOn,
          },
          {
            columnAlias: "comment",
            value: getCommentParts(item.comment).comment,
          },
          {
            columnAlias: "status",
            value: item.status as WorkflowStatusModel,
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

export default WorkflowInstancesTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowInstancesTableElement;
  }
}
