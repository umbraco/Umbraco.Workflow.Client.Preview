import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  ReleaseSetsService,
  ReleaseSetsSettingsModel,
} from "@umbraco-workflow/generated";
import { WorkflowSettingsServerDataSourceBase } from "@umbraco-workflow/core";

export class WorkflowReleaseSetSettingsServerDataSource extends WorkflowSettingsServerDataSourceBase<ReleaseSetsSettingsModel> {
  constructor(host: UmbControllerHost) {
    super({
      host,
      read: async () => ReleaseSetsService.getReleaseSetSettings(),
      update: async (args) => ReleaseSetsService.putReleaseSetSettings(args),
    });
  }
}
