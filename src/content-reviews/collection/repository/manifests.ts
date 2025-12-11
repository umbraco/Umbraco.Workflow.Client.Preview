import { WORKFLOW_CONTENTREVIEWS_COLLECTION_REPOSITORY_ALIAS } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_CONTENTREVIEWS_COLLECTION_REPOSITORY_ALIAS,
    name: "Workflow Content Reviews Collection Repository",
    api: () => import("./content-reviews-collection.repository.js"),
  },
];
