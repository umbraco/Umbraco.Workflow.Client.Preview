import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import type { ManifestCollectionView } from "@umbraco-cms/backoffice/extension-registry";

export const WORKFLOW_APPROVALGROUP_TABLE_COLLECTION_VIEW_ALIAS =
  "Umb.Workflow.CollectionView.ApprovalGroup.Table";

const tableCollectionView: ManifestCollectionView = {
  type: "collectionView",
  alias: WORKFLOW_APPROVALGROUP_TABLE_COLLECTION_VIEW_ALIAS,
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
      match: "Umb.Workflow.Collection.ApprovalGroup",
    },
  ],
};

export const manifests = [tableCollectionView];
