import { manifests as collectionConditionManifests } from "../conditions/manifests.js";
import {
  manifests as collectionRepositoryManifests,
} from "./repository/manifests.js";
import { manifests as collectionViewsManifests } from "./views/manifests.js";
import { manifests as collectionActionManifests } from "./action/manifests.js";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS, WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
    name: "Approval Group Collection",
    meta: {
      repositoryAlias: WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  ...collectionRepositoryManifests,
  ...collectionViewsManifests,
  ...collectionActionManifests,
  ...collectionConditionManifests,
];
