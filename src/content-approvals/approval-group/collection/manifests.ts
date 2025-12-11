import {
  WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
  WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS,
} from "./constants.js";
import { manifests as conditionManifests } from "../conditions/manifests.js";
import { manifests as repositoryManifests } from "./repository/manifests.js";
import { manifests as viewManifests } from "./views/manifests.js";
import { manifests as actionManifests } from "./action/manifests.js";
import { manifests as entityActionManifests } from "./entity-actions/manifests.js";

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
  ...repositoryManifests,
  ...viewManifests,
  ...actionManifests,
  ...conditionManifests,
  ...entityActionManifests,
];
