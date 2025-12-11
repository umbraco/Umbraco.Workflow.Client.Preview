import { WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS } from "../../collection/index.js";
import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_MYSUBMISSIONS_COLLECTION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_MYSUBMISSIONS_COLLECTION_ALIAS,
    name: "Workflow My Submissions Collection",
    api: () => import("./my-submissions-collection.context.js"),
    element: () => import("./my-submissions-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_INSTANCES_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  {
    type: "collectionView",
    kind: "workflowDefaultCollection",
    alias: "Workflow.CollectionView.Submissions.Table",
    name: "Workflow My Submissions Table Collection View",
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_MYSUBMISSIONS_COLLECTION_ALIAS,
      },
    ],
  },
];
