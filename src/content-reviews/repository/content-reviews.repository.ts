import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowContentReviewsServerDataSource } from "./content-reviews.server.data.js";
import { WORKFLOW_CONTENTREVIEWS_STORE_CONTEXT } from "./content-reviews.store.js";
import { WorkflowRepositoryBase } from "@umbraco-workflow/repository";
import type {
  ContentReviewsConfigModel,
  ContentReviewsSaveSettingsModel,
} from "@umbraco-workflow/generated";

export class WorkflowContentReviewsRepository extends WorkflowRepositoryBase<
  ContentReviewsConfigModel,
  ContentReviewsSaveSettingsModel
> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowContentReviewsServerDataSource,
      WORKFLOW_CONTENTREVIEWS_STORE_CONTEXT
    );
  }
}

export { WorkflowContentReviewsRepository as api };
