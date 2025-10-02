import { WorkflowReleaseSetItemCollectionContext } from "./release-set-item-collection.context.js";
import { manifests as viewManifests } from "./views/manifests.js";
import { manifests as actionManifests } from "./actions/manifests.js";
import { manifests as bulkActionManifests } from "./entity-bulk-actions/manifests.js";
import { WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS, WORKFLOW_RELEASESET_ITEM_COLLECTION_REPOSITORY_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...viewManifests,
  ...actionManifests,
  ...bulkActionManifests,
  {
    type: "repository",
    alias: WORKFLOW_RELEASESET_ITEM_COLLECTION_REPOSITORY_ALIAS,
    name: "Release Set Item Collection Repository",
    api: () => import("./release-set-item-collection.repository.js"),
  },
  {
    type: "collection",
    alias: WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS,
    name: "Workflow Release Set Item Collection",
    api: WorkflowReleaseSetItemCollectionContext,
    element: () => import("./release-set-item-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_RELEASESET_ITEM_COLLECTION_REPOSITORY_ALIAS,
    },
  },
];
