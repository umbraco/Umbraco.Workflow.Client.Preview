import { WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS,
    name: "Workflow Instances Collection Repository",
    api: () => import("./instances-collection.repository.js"),
  },
];
