import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import { WorkflowInstancesCollectionServerDataSource } from "./instances-collection.server.data-source.js";
import {
  WorkflowInstancesCollectionFilterModel,
  WorkflowInstancesCollectionModel,
} from "../entities.js";

export class WorkflowHistoryCollectionRepository
  extends UmbControllerBase
  implements
    UmbCollectionRepository<
      WorkflowInstancesCollectionModel,
      WorkflowInstancesCollectionFilterModel
    >
{
  #collectionSource: WorkflowInstancesCollectionServerDataSource;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#collectionSource = new WorkflowInstancesCollectionServerDataSource(
      this._host
    );
  }

  async requestCollection(filter: WorkflowInstancesCollectionFilterModel) {
    return await this.#collectionSource.getCollection(filter);
  }
}

export default WorkflowHistoryCollectionRepository;
