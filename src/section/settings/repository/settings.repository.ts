import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { WorkflowRepositoryBase } from "../../workflow-repository.base.js";
import { WorkflowSettingsServerDataSource } from "./settings.server.data.js";
import { WORKFLOW_SETTINGS_STORE_CONTEXT } from "./settings.store.js";
import {
  EmailTemplateService,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";

export class WorkflowSettingsRepository extends WorkflowRepositoryBase<WorkflowSettingsPropertiesModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowSettingsServerDataSource,
      WORKFLOW_SETTINGS_STORE_CONTEXT
    );
  }

  async installEmailTemplates() {
    const { data, error } = await tryExecuteAndNotify(
      this,
      EmailTemplateService.getEmailTemplateInstall()
    );

    if (!data || error) {
      const notification = {
        data: { message: "Unable to install email templates" },
      };
      this.notificationContext?.peek("danger", notification);
      return;
    }

    const notification = { data: { message: "Email templates installed" } };
    this.notificationContext?.peek("positive", notification);
  }
}
