import {
  UMB_COLLECTION_ALIAS_CONDITION,
} from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [{
  type: "collectionView",
  alias: "Workflow.CollectionView.ApprovalGroup.Table",
  name: "Workflow Approval Group Table Collection View",
  js: () => import("./table/approval-groups-table-collection-view.element.js"),
  meta: {
    label: "Table",
    icon: "icon-list",
    pathName: "table",
  },
  conditions: [
    {
      alias: UMB_COLLECTION_ALIAS_CONDITION,
      match: WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
    },
  ],
}];
