import { WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS } from "../../collection/index.js";
import { WORKFLOW_HISTORY_COLLECTION_ALIAS } from "./constants.js";
import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_HISTORY_COLLECTION_ALIAS,
    name: "Workflow History Collection",
    api: () => import("./history-collection.context.js"),
    element: () => import("./history-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  {
    type: "collectionView",
    kind: "workflowDefaultCollection",
    alias: "Workflow.CollectionView.History.Table",
    name: "Workflow History Table Collection View",
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_HISTORY_COLLECTION_ALIAS,
      },
    ],
  },
];
