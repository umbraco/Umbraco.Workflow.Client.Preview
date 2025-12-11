import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowContentReviewsCollectionFilterModel,
  WorkflowContentReviewsCollectionModel,
} from "../../collection/entities.js";
import { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_CONTENTREVIEWS_TABLE_COLLECTION_VIEW_ALIAS } from "../../collection/constants.js";

export class WorkflowMyReviewsCollectionContext extends UmbDefaultCollectionContext<
  WorkflowContentReviewsCollectionModel,
  WorkflowContentReviewsCollectionFilterModel
> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_CONTENTREVIEWS_TABLE_COLLECTION_VIEW_ALIAS, {
      sortBy: "dueOn",
      sortDirection: "asc",
      currentUser: true,
    });

    this.setConfig({ pageSize: 5 });
  }
}

export { WorkflowMyReviewsCollectionContext as api };
