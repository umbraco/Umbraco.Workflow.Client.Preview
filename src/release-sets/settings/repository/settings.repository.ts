import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowRepositoryBase } from "@umbraco-workflow/repository";
import { ReleaseSetsSettingsModel } from "@umbraco-workflow/generated";
import { WorkflowReleaseSetSettingsServerDataSource } from "./settings.server.data.js";
import { WORKFLOW_RELEASESET_SETTINGS_STORE_CONTEXT } from "./settings.store.js";

export class WorkflowReleaseSetSettingsRepository extends WorkflowRepositoryBase<ReleaseSetsSettingsModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowReleaseSetSettingsServerDataSource,
      WORKFLOW_RELEASESET_SETTINGS_STORE_CONTEXT
    );
  }
}

export { WorkflowReleaseSetSettingsRepository as api };
