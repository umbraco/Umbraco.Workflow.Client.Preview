import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbCollectionDataSource } from "@umbraco-cms/backoffice/collection";
import {
  WorkflowContentReviewsCollectionModel,
  WorkflowContentReviewsCollectionFilterModel,
} from "../entities.js";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { ContentReviewService } from "@umbraco-workflow/generated";
import { UmbId } from "@umbraco-cms/backoffice/id";
import { WORKFLOW_CONTENTREVIEW_ENTITY_TYPE } from "src/content-reviews/constants.js";

export class WorkflowContentReviewsCollectionServerDataSource
  extends UmbControllerBase
  implements UmbCollectionDataSource<WorkflowContentReviewsCollectionModel>
{
  async getCollection(filter: WorkflowContentReviewsCollectionFilterModel) {
    const { data, error } = await tryExecute(
      this._host,
      ContentReviewService.postContentReviewNodes({ body: filter })
    );

    if (error) {
      return { error };
    }

    return {
      data: {
        items: data.items.map((d) => ({
          ...d,
          entityType: WORKFLOW_CONTENTREVIEW_ENTITY_TYPE,
          unique: UmbId.new(),
        })),
        total: data.totalItems,
      },
    };
  }
}
