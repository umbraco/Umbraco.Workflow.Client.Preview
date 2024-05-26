import type { ManifestRepository } from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowSettingsRepository } from "./settings.repository.js";
import { WorkflowSettingsStore } from "./settings.store.js";
import type { ManifestWorkflowObjectStore } from "@umbraco-workflow/repository";

export const WORKFLOW_SETTINGS_REPOSITORY_ALIAS =
  "Workflow.Repository.Settings";

export const WORKFLOW_SETTINGS_STORE_ALIAS = "Workflow.Store.Settings";

const repository: ManifestRepository = {
  type: "repository",
  alias: WORKFLOW_SETTINGS_REPOSITORY_ALIAS,
  name: "Workflow Settings Repository",
  api: WorkflowSettingsRepository,
};

const store: ManifestWorkflowObjectStore = {
  type: "workflowObjectStore",
  alias: WORKFLOW_SETTINGS_STORE_ALIAS,
  name: "Workflow Settings Store",
  api: WorkflowSettingsStore,
};

export const manifests = [repository, store];
