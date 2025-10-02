import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS } from "../constants.js";
import {
  manifests as alternateVersionsRepositoryManifests,
} from "./repository/manifests.js";
import { manifests as actionManifests } from "./action/manifests.js";
import { manifests as viewManifests } from "./views/manifests.js";
import { manifests as entityBulkActionManifests } from "./entity-bulk-actions/manifests.js";
import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_REPOSITORY_ALIAS } from "./repository/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS,
    name: "Alternate Versions Collection",
    meta: {
      repositoryAlias: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  ...alternateVersionsRepositoryManifests,
  ...actionManifests,
  ...entityBulkActionManifests,
  ...viewManifests,
];
