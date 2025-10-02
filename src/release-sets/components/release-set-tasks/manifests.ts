import { manifests as viewManifests } from "./views/manifests.js";
import { manifests as actionManifests } from "./actions/manifests.js";
import { manifests as bulkActionManifests } from "./entity-bulk-actions/manifests.js";
import { WorkflowReleaseSetTaskCollectionContext } from "./release-set-task-collection.context.js";
import { WORKFLOW_RELEASESET_TASK_COLLECTION_REPOSITORY_ALIAS, WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...viewManifests,
  ...actionManifests,
  ...bulkActionManifests,
  {
    type: "repository",
    alias: WORKFLOW_RELEASESET_TASK_COLLECTION_REPOSITORY_ALIAS,
    name: "Release Set Task Collection Repository",
    api: () => import("./release-set-task-collection.repository.js"),
  },
  {
    type: "collection",
    alias: WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS,
    name: "Workflow Release Set Task Collection",
    api: WorkflowReleaseSetTaskCollectionContext,
    element: () => import("./release-set-task-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_RELEASESET_TASK_COLLECTION_REPOSITORY_ALIAS,
    },
  },
];
