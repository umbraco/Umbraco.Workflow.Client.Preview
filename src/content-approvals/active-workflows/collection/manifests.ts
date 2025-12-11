import { WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS } from "../../collection/index.js";
import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_ALIAS,
    name: "Workflow Active Workflows Collection",
    api: () => import("./active-workflows-collection.context.js"),
    element: () => import("./active-workflows-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  {
    type: "collectionView",
    kind: "workflowDefaultCollection",
    alias: "Workflow.CollectionView.ActiveWorkflows.Table",
    name: "Workflow Active Workflows Table Collection View",
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_ALIAS,
      },
    ],
  },
];
