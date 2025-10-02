import { customElement } from "@umbraco-cms/backoffice/external/lit";
import {
  WORKFLOW_RELEASESET_TASK_COLLECTION_CONTEXT,
  WorkflowReleaseSetTaskCollectionContext,
} from "../../release-set-task-collection.context.js";
import { WorkflowReleaseSetComponentTableCollectionViewBaseElement } from "../../../../components/release-set-component-table-collection-view-base.element.js";
import {
  ReleaseSetTaskStatusModel,
  type ReleaseSetTaskResponseModelReadable,
} from "@umbraco-workflow/generated";

import "./elements/release-set-task-table-collection-name-column-layout.element.js";
import "./elements/release-set-task-table-collection-assignedto-column-layout.element.js";

const elementName = "workflow-releaseset-task-table-collection-view";

@customElement(elementName)
export class WorkflowReleaseSetTaskTableCollectionViewElement extends WorkflowReleaseSetComponentTableCollectionViewBaseElement<
  ReleaseSetTaskResponseModelReadable,
  WorkflowReleaseSetTaskCollectionContext
> {
  constructor() {
    super(WORKFLOW_RELEASESET_TASK_COLLECTION_CONTEXT);

    this.tableColumns = [
      {
        name: this.localize.term("general_name"),
        alias: "name",
        elementName: "release-set-task-table-name-column-layout",
      },
      {
        name: this.localize.term("workflow_releaseSets_assignedTo"),
        alias: "assignedTo",
        elementName: "release-set-task-table-assignedto-column-layout",
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

  #createTableItems(result: Array<ReleaseSetTaskResponseModelReadable>) {
    this.tableItems = result.map(
      (item: ReleaseSetTaskResponseModelReadable) => {
        return {
          id: item.unique,
          icon:
            Object.values(ReleaseSetTaskStatusModel)[item.status] ===
            ReleaseSetTaskStatusModel.ACTIVE
              ? "icon-calendar-alt"
              : "icon-calendar",
          data: [
            {
              columnAlias: "name",
              value: item,
            },
            {
              columnAlias: "assignedTo",
              value: item.assignedTo,
            },
            {
              columnAlias: "status",
              value: item.status,
            },
          ],
        };
      }
    );
  }
}

export default WorkflowReleaseSetTaskTableCollectionViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetTaskTableCollectionViewElement;
  }
}
