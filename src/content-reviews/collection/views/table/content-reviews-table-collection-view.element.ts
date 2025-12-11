import type {
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import { WorkflowContentReviewsCollectionModel } from "../../entities.js";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";

import "./elements/content-reviews-table-groups-column-layout.element.js";
import "../../../../core/collection/table-date-column-layout.element.js";

const elementName = "content-reviews-table";

@customElement(elementName)
export class ContentReviewsTableElement extends UmbLitElement {
  #collectionContext?: typeof UMB_COLLECTION_CONTEXT.TYPE;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: false,
    hideIcon: false,
  };

  @state()
  private _isCultureVariant = false;

  @state()
  private _tableColumns = [
    {
      name: `${this.localize.term("headers_page")} ${
        this._isCultureVariant
          ? `(${this.localize.term("general_language")})`
          : ""
      }`,
      alias: "page",
      elementName: "workflow-table-name-column-layout",
    },
    {
      name: this.localize.term("workflow_contentReviews_nextReviewDue"),
      alias: "dueOn",
      elementName: "workflow-table-date-column-layout",
    },
    {
      name: this.localize.term("workflow_contentReviews_lastReviewed"),
      alias: "lastReviewed",
      elementName: "workflow-table-date-column-layout",
    },
    {
      name: this.localize.term("workflow_contentReviews_reviewPeriod"),
      alias: "reviewPeriod",
    },
    {
      name: this.localize.term("workflow_contentReviews_reviewGroup"),
      alias: "reviewGroup",
      elementName: "content-reviews-table-group-column-layout",
    },
  ];

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  constructor() {
    super();

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

  #createTableItems(items: Array<WorkflowContentReviewsCollectionModel>) {
    this._tableItems = items.map(
      (item: WorkflowContentReviewsCollectionModel) => {
        return {
          id: item.unique,
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
      }
    );
  }

  override render() {
    return html`
      <umb-table
        .config=${this._tableConfig}
        .columns=${this._tableColumns}
        .items=${this._tableItems}
      ></umb-table>
    `;
  }
}

export default ContentReviewsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsTableElement;
  }
}
