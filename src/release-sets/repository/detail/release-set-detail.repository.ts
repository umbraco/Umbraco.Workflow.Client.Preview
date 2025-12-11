import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowReleaseSetDetailServerDataSource } from "./release-set-detail.server.data-source.js";
import { WORKFLOW_RELEASESET_DETAIL_STORE_CONTEXT } from "./release-set-detail.store.js";
import { type ReleaseSetDetailResponseModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetDetailRepository extends UmbDetailRepositoryBase<ReleaseSetDetailResponseModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowReleaseSetDetailServerDataSource,
      WORKFLOW_RELEASESET_DETAIL_STORE_CONTEXT
    );
  }
}

export default WorkflowReleaseSetDetailRepository;
