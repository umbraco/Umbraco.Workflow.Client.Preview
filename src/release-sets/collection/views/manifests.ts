import {
  UMB_COLLECTION_ALIAS_CONDITION,
  type ManifestCollectionView,
} from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESETS_COLLECTION_ALIAS } from "../constants.js";

export const manifests: Array<ManifestCollectionView> = [{
  type: "collectionView",
  alias:  "Workflow.CollectionView.ReleaseSet.Table",
  name: "Workflow Release Set Table Collection View",
  js: () => import("./table/release-set-table-collection-view.element.js"),
  meta: {
    label: "Table",
    icon: "icon-list",
    pathName: "table",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: WORKFLOW_RELEASESETS_COLLECTION_ALIAS,
    },
  ],
}];
