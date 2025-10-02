import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import {
  WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS,
  WORKFLOW_RELEASESET_TASK_TABLE_COLLECTION_VIEW_ALIAS,
} from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collectionView",
    alias: WORKFLOW_RELEASESET_TASK_TABLE_COLLECTION_VIEW_ALIAS,
    name: "Workflow Release Set Task Table Collection View",
    js: () =>
      import("./table/release-set-task-table-collection-view.element.js"),
    meta: {
      label: "Table",
      icon: "icon-list",
      pathName: "table",
    },
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS,
      },
    ],
  },
];
