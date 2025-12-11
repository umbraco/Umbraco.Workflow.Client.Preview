import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowContentReviewsCollectionFilterModel,
  WorkflowContentReviewsCollectionModel,
} from "./entities.js";
import { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_CONTENTREVIEWS_TABLE_COLLECTION_VIEW_ALIAS } from "./constants.js";

export class WorkflowContentReviewsCollectionContext extends UmbDefaultCollectionContext<
  WorkflowContentReviewsCollectionModel,
  WorkflowContentReviewsCollectionFilterModel
> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_CONTENTREVIEWS_TABLE_COLLECTION_VIEW_ALIAS, {
      sortBy: "dueOn",
      sortDirection: "asc",
    });

    this.setConfig({ pageSize: 10 });
  }
}

export { WorkflowContentReviewsCollectionContext as api };
