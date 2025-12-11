import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_CONTENTREVIEWS_COLLECTION_REPOSITORY_ALIAS } from "../../collection/index.js";
import { WORKFLOW_MYREVIEWS_COLLECTION_ALIAS } from "./constants.js";

export const manifests = [
  {
    type: "collection",
    kind: "default",
    alias: WORKFLOW_MYREVIEWS_COLLECTION_ALIAS,
    name: "Workflow My Reviews Collection",
    api: () => import("./my-reviews-collection.context.js"),
    element: () => import("./my-reviews-collection.element.js"),
    meta: {
      repositoryAlias: WORKFLOW_CONTENTREVIEWS_COLLECTION_REPOSITORY_ALIAS,
    },
  },
  {
    type: "collectionView",
    alias: "Workflow.CollectionView.MyReviews.Table",
    name: "Workflow Content Reviews Table Collection View",
    js: () =>
      import(
        "../../collection/views/table/content-reviews-table-collection-view.element.js"
      ),
    meta: {
      label: "Table",
      icon: "icon-list",
      pathName: "table",
    },
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_MYREVIEWS_COLLECTION_ALIAS,
      },
    ],
  },
];
