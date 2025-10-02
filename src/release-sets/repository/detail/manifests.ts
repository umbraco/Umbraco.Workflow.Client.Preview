import { WORKFLOW_RELEASESET_DETAIL_STORE_ALIAS, WORKFLOW_RELEASESET_DETAIL_REPOSITORY_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_RELEASESET_DETAIL_REPOSITORY_ALIAS,
    name: "Release Set Detail Repository",
    api: () => import("./release-set-detail.repository.js"),
  },
  {
    type: "store",
    alias: WORKFLOW_RELEASESET_DETAIL_STORE_ALIAS,
    name: "Release Set Detail Store",
    api: () => import("./release-set-detail.store.js"),
  },
];
