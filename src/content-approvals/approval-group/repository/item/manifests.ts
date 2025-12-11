export const WORKFLOW_APPROVALGROUP_ITEM_REPOSITORY_ALIAS =
  "Workflow.Repository.ApprovalGroupItem";
export const WORKFLOW_APPROVALGROUP_ITEM_STORE_ALIAS =
  "Workflow.Store.ApprovalGroupItem";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "repository",
    alias: WORKFLOW_APPROVALGROUP_ITEM_REPOSITORY_ALIAS,
    name: "Approval Group Item Repository",
    api: () => import("./approval-group-item.repository.js"),
  },
  {
    type: "store",
    alias: WORKFLOW_APPROVALGROUP_ITEM_STORE_ALIAS,
    name: "Approval Group Item Store",
    api: () => import("./approval-group-item.store.js"),
  },
];
