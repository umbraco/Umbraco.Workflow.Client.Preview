import type {
  ManifestRepository,
} from "@umbraco-cms/backoffice/extension-registry";
import type { ManifestWorkflowObjectStore } from "../../workflow-object-store.js";
import { WorkflowSettingsRepository } from "./settings.repository.js";
import { WorkflowSettingsStore } from "./settings.store.js";

export const WORKFLOW_SETTINGS_REPOSITORY_ALIAS =
  "Umb.Repository.Workflow.Settings";

export const WORKFLOW_SETTINGS_STORE_ALIAS = "Umb.Store.Workflow.Settings";

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
