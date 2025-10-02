import { manifests as releaseSetsRepositoryManifests } from "./repository/manifests.js";
import { manifests as actionManifests } from "./action/manifests.js";
import { manifests as viewManifests } from "./views/manifests.js";
import { manifests as bulkActionManifests } from "./entity-bulk-actions/manifests.js";
import {
  WORKFLOW_RELEASESETS_COLLECTION_REPOSITORY_ALIAS,
  WORKFLOW_RELEASESETS_COLLECTION_ALIAS,
} from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_RELEASESETS_COLLECTION_ALIAS,
    name: "Release Sets Collection",
    meta: {
      repositoryAlias: WORKFLOW_RELEASESETS_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  ...releaseSetsRepositoryManifests,
  ...actionManifests,
  ...viewManifests,
  ...bulkActionManifests,
];
