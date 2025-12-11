import { WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS } from "../../collection/index.js";
import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_MYTASKS_COLLECTION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_MYTASKS_COLLECTION_ALIAS,
    name: "Workflow My Tasks Collection",
    api: () => import("./my-tasks-collection.context.js"),
    element: () => import("./my-tasks-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  {
    type: "collectionView",
    kind: "workflowDefaultCollection",
    alias: "Workflow.CollectionView.MyTasks.Table",
    name: "Workflow My Tasks Table Collection View",
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_MYTASKS_COLLECTION_ALIAS,
      },
    ],
  },
];
