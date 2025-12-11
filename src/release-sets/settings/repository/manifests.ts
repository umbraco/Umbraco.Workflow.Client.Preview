import { WORKFLOW_OBJECT_STORE_TYPE_ALIAS } from "@umbraco-workflow/core";
import {
  WORKFLOW_RELEASESET_SETTINGS_STORE_ALIAS,
  WORKFLOW_RELEASESET_SETTINGS_REPOSITORY_ALIAS,
} from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_RELEASESET_SETTINGS_REPOSITORY_ALIAS,
    name: "Workflow Release Set Settings Repository",
    api: () => import("./settings.repository.js"),
  },
  {
    type: WORKFLOW_OBJECT_STORE_TYPE_ALIAS,
    alias: WORKFLOW_RELEASESET_SETTINGS_STORE_ALIAS,
    name: "Workflow Release Set Settings Store",
    api: () => import("./settings.store.js"),
  },
];
