import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { WorkflowServerDataSource } from "@umbraco-workflow/repository";
import {
  ContentReviewService,
  type ContentReviewsConfigModel,
  type ContentReviewsSaveSettingsModel,
} from "@umbraco-workflow/generated";

/**
 * A data source for Content reviews that fetches data from the server
 * @export
 * @class WorkflowContentReviewsServerDataSource
 * @implements {WorkflowDetailDataSource}
 */
export class WorkflowContentReviewsServerDataSource
  implements
    WorkflowServerDataSource<
      ContentReviewsConfigModel,
      ContentReviewsSaveSettingsModel
    >
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async read() {
    return tryExecute(
      this.#host,
      ContentReviewService.getContentReviewConfig()
    );
  }

  async update(data: ContentReviewsSaveSettingsModel) {
    return tryExecute(
      this.#host,
      ContentReviewService.putContentReviewConfig({ body: data })
    );
  }
}
