import { WORKFLOW_ALTERNATEVERSION_ITEM_STORE_ALIAS, WORKFLOW_ALTERNATEVERSION_ITEM_REPOSITORY_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_ALTERNATEVERSION_ITEM_REPOSITORY_ALIAS,
    name: "Alternate Version Item Repository",
    api: () => import("./alternate-version-item.repository.js"),
  },
  {
    type: "store",
    alias: WORKFLOW_ALTERNATEVERSION_ITEM_STORE_ALIAS,
    name: "Alternate Version Item Store",
    api: () => import("./alternate-version-item.store.js"),
  },
];
