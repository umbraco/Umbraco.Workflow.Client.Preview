import { WORKFLOW_SETTINGS_REPOSITORY_ALIAS, WORKFLOW_SETTINGS_STORE_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_SETTINGS_REPOSITORY_ALIAS,
    name: "Workflow Settings Repository",
    api: () => import("./settings.repository.js"),
  },
  {
    type: "workflowObjectStore",
    alias: WORKFLOW_SETTINGS_STORE_ALIAS,
    name: "Workflow Settings Store",
    api: () => import("./settings.store.js"),
  },
];
