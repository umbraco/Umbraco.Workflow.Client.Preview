import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowInstancesCollectionFilterModel,
  WorkflowInstancesCollectionModel,
  WORKFLOW_INSTANCES_TABLE_COLLECTION_VIEW_ALIAS,
} from "../../collection/index.js";
import { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";

export class WorkflowHistoryCollectionContext extends UmbDefaultCollectionContext<
  WorkflowInstancesCollectionModel,
  WorkflowInstancesCollectionFilterModel
> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_INSTANCES_TABLE_COLLECTION_VIEW_ALIAS, {
      sortDirection: "desc",
      filters: {
        historyOnly: true,
      },
    });

    this.setConfig({ pageSize: 10 });
  }
}

export { WorkflowHistoryCollectionContext as api };
