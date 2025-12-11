import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowSettingsServerDataSourceBase } from "@umbraco-workflow/repository";
import {
  ContentReviewService,
  type ContentReviewsConfigModel,
  type ContentReviewsSaveSettingsModel,
} from "@umbraco-workflow/generated";

export class WorkflowContentReviewsServerDataSource extends WorkflowSettingsServerDataSourceBase<
  ContentReviewsConfigModel,
  ContentReviewsSaveSettingsModel
> {
  constructor(host: UmbControllerHost) {
    super({
      host,
      read: async () => ContentReviewService.getContentReviewConfig(),
      update: async (args) => ContentReviewService.putContentReviewConfig(args),
    });
  }
}
