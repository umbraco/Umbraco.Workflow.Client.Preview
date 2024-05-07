import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowObjectStore } from "../../workflow-object-store.js";
import type { WorkflowSettingsPropertiesModel } from "@umbraco-workflow/generated";

export class WorkflowSettingsStore extends WorkflowObjectStore<WorkflowSettingsPropertiesModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_SETTINGS_STORE_CONTEXT.toString());
  }
}

export const WORKFLOW_SETTINGS_STORE_CONTEXT =
  new UmbContextToken<WorkflowSettingsStore>("WorkflowSettingsStore");
