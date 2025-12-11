import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowSettingsServerDataSourceBase } from "@umbraco-workflow/core";
import {
  SettingsService,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";

export class WorkflowSettingsServerDataSource extends WorkflowSettingsServerDataSourceBase<WorkflowSettingsPropertiesModel> {
  constructor(host: UmbControllerHost) {
    super({
      host,
      read: () => SettingsService.getSettings(),
      update: (args) => SettingsService.putSettings(args),
    });
  }
}
