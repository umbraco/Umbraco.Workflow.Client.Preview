import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type { WorkflowServerDataSource } from "../../workflow-server-data-source.js";
import type { ContentReviewsConfigModel, ContentReviewsSaveSettingsModel } from "@umbraco-workflow/generated";
import { ContentReviewResource } from "@umbraco-workflow/generated";

/**
 * A data source for Content reviews that fetches data from the server
 * @export
 * @class WorkflowContentReviewsServerDataSource
 * @implements {WorkflowDetailDataSource}
 */
export class WorkflowContentReviewsServerDataSource implements WorkflowServerDataSource<ContentReviewsConfigModel, ContentReviewsSaveSettingsModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async read() {
    return tryExecuteAndNotify(
      this.#host,
      ContentReviewResource.getContentReviewConfig()
    );
  }

  async update(data: ContentReviewsSaveSettingsModel) {   
    return tryExecuteAndNotify(
      this.#host,
      ContentReviewResource.putContentReviewConfig({ requestBody: data })
    );
  }
}
