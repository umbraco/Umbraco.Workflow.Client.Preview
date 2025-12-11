import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowInstancesCollectionFilterModel,
  WorkflowInstancesCollectionModel,
  WORKFLOW_INSTANCES_TABLE_COLLECTION_VIEW_ALIAS,
} from "../../collection/index.js";
import { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { InstanceService } from "@umbraco-workflow/generated";

export class WorkflowActiveWorkflowsCollectionContext extends UmbDefaultCollectionContext<
  WorkflowInstancesCollectionModel,
  WorkflowInstancesCollectionFilterModel
> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_INSTANCES_TABLE_COLLECTION_VIEW_ALIAS, {
      handler: InstanceService.postInstanceActive,
    });

    this.setConfig({ pageSize: 10 });
  }
}

export { WorkflowActiveWorkflowsCollectionContext as api };
