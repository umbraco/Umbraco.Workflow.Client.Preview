import { WORKFLOW_CONTENTREVIEWS_REPOSITORY_ALIAS, WORKFLOW_CONTENTREVIEWS_STORE_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_CONTENTREVIEWS_REPOSITORY_ALIAS,
    name: "Workflow Content Reviews Repository",
    api: () => import("./content-reviews.repository.js"),
  },
  {
    type: "workflowObjectStore",
    alias: WORKFLOW_CONTENTREVIEWS_STORE_ALIAS,
    name: "Workflow Content Reviews Settings Store",
    api: () => import("./content-reviews.store.js"),
  },
];
