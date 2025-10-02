import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { WorkflowSettingsServerDataSource } from "./settings.server.data.js";
import { WORKFLOW_SETTINGS_STORE_CONTEXT } from "./settings.store.js";
import {
  EmailTemplateService,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";
import { WorkflowRepositoryBase } from "@umbraco-workflow/repository";
import { WorkflowNotificationManagerController } from "@umbraco-workflow/core";

export class WorkflowSettingsRepository extends WorkflowRepositoryBase<WorkflowSettingsPropertiesModel> {
  #notificationManager = new WorkflowNotificationManagerController(this);

  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowSettingsServerDataSource,
      WORKFLOW_SETTINGS_STORE_CONTEXT
    );
  }

  async installEmailTemplates() {
    const data = await tryExecute(
      this,
      EmailTemplateService.getEmailTemplateInstall()
    );

    if (!data || data.error) {
      this.#notificationManager.notify({
        color: "danger",
        key: "workflow_emailTemplatesNotInstalled",
      });
      return;
    }
  }
}

export { WorkflowSettingsRepository as api };
