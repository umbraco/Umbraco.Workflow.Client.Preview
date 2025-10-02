import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT, WorkflowReleaseSetItemCollectionContext } from "../../release-set-item-collection.context.js";
import { WorkflowReleaseSetComponentTableCollectionViewBaseElement } from "../../../../components/release-set-component-table-collection-view-base.element.js";
import {
  ReleaseSetItemStatusModel,
  type ReleaseSetItemResponseModelReadable,
} from "@umbraco-workflow/generated";

import "./elements/release-set-item-table-collection-name-column-layout.element.js";

const elementName = "workflow-releaseset-item-table-collection-view";

@customElement(elementName)
export class WorkflowReleaseSetItemTableCollectionViewElement extends WorkflowReleaseSetComponentTableCollectionViewBaseElement<ReleaseSetItemResponseModelReadable, WorkflowReleaseSetItemCollectionContext> {
  constructor() {
    super(WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT);

    this.tableColumns = [
      {
        name: this.localize.term("general_name"),
        alias: "name",
        elementName: "release-set-item-table-name-column-layout",
      },
      {
        name: this.localize.term("workflow_releaseSets_itemCount"),
        alias: "itemCount",
      },
      {
        name: this.localize.term("workflow_releaseSets_status"),
        alias: "status",
        elementName: "status-tag",
      },
    ];
  }

  async connectedCallback() {
    super.connectedCallback();

    await this.init;

    this.observe(this.collectionContext?.items, (collectionItems) => {
      if (!collectionItems) return;
      this.#createTableItems(collectionItems);
    });
  }

  #createTableItems<T extends ReleaseSetItemResponseModelReadable>(
    result: Array<T>
  ) {
    this.tableItems = result.map((item: T) => {
      return {
        id: item.unique,
        icon: item.icon,
        data: [
          {
            columnAlias: "name",
            value: item,
          },
          {
            columnAlias: "itemCount",
            value: item.items.length,
          },
          {
            columnAlias: "status",
            value: this.#calculateItemStatus(item),
          },
        ],
      };
    });
  }

  #calculateItemStatus<T extends ReleaseSetItemResponseModelReadable>(item: T) {
    return !item.items.length ||
      item.items.some((x) => x.status === ReleaseSetItemStatusModel.DRAFT)
      ? ReleaseSetItemStatusModel.DRAFT
      : ReleaseSetItemStatusModel.READY_TO_PUBLISH;
  }
}

export default WorkflowReleaseSetItemTableCollectionViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetItemTableCollectionViewElement;
  }
}
