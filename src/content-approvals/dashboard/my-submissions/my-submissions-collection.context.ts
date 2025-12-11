import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowInstancesCollectionFilterModel,
  WorkflowInstancesCollectionModel,
  WORKFLOW_INSTANCES_TABLE_COLLECTION_VIEW_ALIAS,
} from "../../collection/index.js";
import { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { InstanceService } from "generated/sdk.gen.js";

export class WorkflowMySubmissionsCollectionContext extends UmbDefaultCollectionContext<
  WorkflowInstancesCollectionModel,
  WorkflowInstancesCollectionFilterModel
> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_INSTANCES_TABLE_COLLECTION_VIEW_ALIAS, {
      handler: InstanceService.postInstanceInitiatedBy,
    });

    this.setConfig({ pageSize: 5 });
  }
}

export { WorkflowMySubmissionsCollectionContext as api };
