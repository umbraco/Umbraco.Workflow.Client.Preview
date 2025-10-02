import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowObjectStore } from "@umbraco-workflow/repository";
import type { WorkflowSettingsPropertiesModel } from "@umbraco-workflow/generated";

export class WorkflowSettingsStore extends WorkflowObjectStore<WorkflowSettingsPropertiesModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_SETTINGS_STORE_CONTEXT.toString());
  }
}

export { WorkflowSettingsStore as api };

export const WORKFLOW_SETTINGS_STORE_CONTEXT =
  new UmbContextToken<WorkflowSettingsStore>("WorkflowSettingsStore");
