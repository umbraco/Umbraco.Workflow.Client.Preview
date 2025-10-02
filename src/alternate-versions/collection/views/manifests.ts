import {
  UMB_COLLECTION_ALIAS_CONDITION,
  type ManifestCollectionView,
} from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS } from "../../constants.js";

export const manifests: Array<ManifestCollectionView> = [{
  type: "collectionView",
  alias: "Workflow.CollectionView.AlternateVersion.Table",
  name: "Workflow Alternate Version Table Collection View",
  js: () => import("./table/alternate-version-table-collection-view.element.js"),
  meta: {
    label: "Table",
    icon: "icon-list",
    pathName: "table",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS,
    },
  ],
}];
