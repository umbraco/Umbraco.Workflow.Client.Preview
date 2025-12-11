import {
  WORKFLOW_CONTENTREVIEWS_COLLECTION_ALIAS,
  WORKFLOW_CONTENTREVIEWS_COLLECTION_REPOSITORY_ALIAS,
} from "./constants.js";
import { manifests as viewManifests } from "./views/manifests.js";
import { manifests as repositoryManifests } from "./repository/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...viewManifests,
  ...repositoryManifests,
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_CONTENTREVIEWS_COLLECTION_ALIAS,
    name: "Workflow Content Reviews Collection",
    api: () => import("./content-reviews-collection.context.js"),
    element: () => import("./content-reviews-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_CONTENTREVIEWS_COLLECTION_REPOSITORY_ALIAS,
    },
  },
];
