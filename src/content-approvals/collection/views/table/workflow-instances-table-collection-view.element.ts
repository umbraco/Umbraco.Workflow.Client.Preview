import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_COLLECTION_CONTEXT,
  UmbDefaultCollectionContext,
} from "@umbraco-cms/backoffice/collection";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";
import { WORKFLOW_SIGNALR_CONTEXT } from "@umbraco-workflow/context";
import { WorkflowInstanceTableResponseModel } from "@umbraco-workflow/generated";
import { getCommentParts, TimeFormatOptions } from "@umbraco-workflow/core";
import {
  WorkflowInstancesCollectionFilterModel,
  WorkflowInstancesCollectionModel,
} from "../../entities.js";

import "./elements/workflow-instances-table-detail-column-layout.element.js";
import "./elements/workflow-instances-table-progress-column-layout.element.js";
import "../../../../core/collection/table-name-column-layout.element.js";

const elementName = "workflow-default-collection-table";

@customElement(elementName)
export class WorkflowInstancesTableCollectionViewElement extends UmbLitElement {
  #collectionContext?: UmbDefaultCollectionContext<
    WorkflowInstancesCollectionModel,
    WorkflowInstancesCollectionFilterModel
  >;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: false,
    hideIcon: false,
  };

  @state()
  private _isCultureVariant = false;

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  @state()
  private _tableColumns = [
    {
      name: `${this.localize.term("general_name")} ${
        this._isCultureVariant
          ? `(${this.localize.term("general_language")})`
          : ""
      }`,
      alias: "page",
      elementName: "workflow-table-name-column-layout",
    },
    {
      name: this.localize.term("workflow_requestedBy"),
      alias: "requestedBy",
    },
    {
      name: this.localize.term("general_comment"),
      alias: "comment",
    },
    {
      name: this.localize.term("workflow_progress"),
      alias: "progress",
      elementName: "workflow-instances-table-progress-column-layout",
    },
    {
      name: this.localize.term("content_type"),
      alias: "action",
    },
    {
      name: "",
      alias: "detail",
      elementName: "workflow-instances-table-detail-column-layout",
      align: "right",
    },
  ];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SIGNALR_CONTEXT, (context) => {
      this.observe(context?.refresh, (refresh) => {
        if (!refresh) return;
        this.#collectionContext?.requestCollection();
      });
    });

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      this.observe(context?.languages, (languages) => {
        this._isCultureVariant = (languages?.length ?? 0) > 1;
      });
    });

    this.consumeContext(UMB_COLLECTION_CONTEXT, (instance) => {
      if (!instance) return;
      this.#collectionContext = instance;

      instance.setupView(this);
      this.#observeCollectionItems();
    });
  }

  async #observeCollectionItems() {
    if (!this.#collectionContext) return;

    this.observe(
      this.#collectionContext.items,
      (collectionItems) => {
        this.#createTableItems(collectionItems);
      },
      Symbol()
    );
  }

  #actionFormatter(item: WorkflowInstanceTableResponseModel) {
    if (!item.scheduled)
      return this.localize.term(`actions_${item.action?.toLowerCase()}`);

    return `${this.localize.term(`workflow_scheduled`)} ${this.localize
      .term(`actions_${item.action?.toLowerCase()}`)
      .toLowerCase()}`;
  }

  #createTableItems(items: Array<WorkflowInstanceTableResponseModel>) {
    this._tableItems = items.map((item: WorkflowInstanceTableResponseModel) => {
      return {
        id: item.unique,
        icon:
          item.status === "Errored"
            ? "alert var(--workflow-errored)"
            : item.document?.icon ?? "document",
        data: [
          {
            columnAlias: "page",
            value: { ...item.document, entityType: item.entityType },
          },
          {
            columnAlias: "action",
            value: this.#actionFormatter(item),
          },
          {
            columnAlias: "requestedBy",
            value: html` <uui-ref-node-user
              style="margin-left: -9px; min-width: 0"
              readonly
              .name=${item.requestedBy ?? ""}
              .groupName=${this.localize.date(
                item.requestedOn!,
                TimeFormatOptions
              )}
            ></uui-ref-node-user>`,
          },
          {
            columnAlias: "comment",
            value: getCommentParts(item.comment).comment,
          },
          // {
          //   columnAlias: "status",
          //   value: item.status,
          // },
          {
            columnAlias: "progress",
            value: item,
          },
          {
            columnAlias: "detail",
            value: item,
          },
        ],
      };
    });
  }

  override render() {
    return html`
      <umb-table
        .config=${this._tableConfig}
        .columns=${this._tableColumns as UmbTableColumn[]}
        .items=${this._tableItems}
      ></umb-table>
    `;
  }
}

export { WorkflowInstancesTableCollectionViewElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowInstancesTableCollectionViewElement;
  }
}
