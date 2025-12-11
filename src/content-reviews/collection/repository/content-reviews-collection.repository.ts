import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import { WorkflowContentReviewsCollectionServerDataSource } from "./content-reviews-collection.server.data-source.js";
import {
  WorkflowContentReviewsCollectionFilterModel,
  WorkflowContentReviewsCollectionModel,
} from "../entities.js";

export class WorkflowContentReviewsCollectionRepository
  extends UmbControllerBase
  implements
    UmbCollectionRepository<
      WorkflowContentReviewsCollectionModel,
      WorkflowContentReviewsCollectionFilterModel
    >
{
  #collectionSource: WorkflowContentReviewsCollectionServerDataSource;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#collectionSource =
      new WorkflowContentReviewsCollectionServerDataSource(this._host);
  }

  async requestCollection(filter: WorkflowContentReviewsCollectionFilterModel) {
    return await this.#collectionSource.getCollection(filter);
  }
}

export default WorkflowContentReviewsCollectionRepository;
