import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESET_ITEM_TABLE_COLLECTION_VIEW_ALIAS } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collectionView",
    alias: WORKFLOW_RELEASESET_ITEM_TABLE_COLLECTION_VIEW_ALIAS,
    name: "Workflow Release Set Item Table Collection View",
    js: () => import("./table/release-set-item-table-collection-view.element.js"),
    meta: {
      label: "Table",
      icon: "icon-list",
      pathName: "table",
    },
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: "Workflow.Collection.ReleaseSetItems",
      },
    ],
  },
];
