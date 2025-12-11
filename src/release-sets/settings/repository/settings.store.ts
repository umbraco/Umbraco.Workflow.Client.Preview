import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { ReleaseSetsSettingsModel } from "@umbraco-workflow/generated";
import { WorkflowObjectStore } from "@umbraco-workflow/repository";

export class WorkflowReleaseSetSettingsStore extends WorkflowObjectStore<ReleaseSetsSettingsModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_RELEASESET_SETTINGS_STORE_CONTEXT.toString());
  }
}

export { WorkflowReleaseSetSettingsStore as api };

export const WORKFLOW_RELEASESET_SETTINGS_STORE_CONTEXT =
  new UmbContextToken<WorkflowReleaseSetSettingsStore>(
    "WorkflowReleaseSetSettingsStore"
  );
