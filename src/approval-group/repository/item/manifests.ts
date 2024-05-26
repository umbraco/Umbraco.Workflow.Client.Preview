import type {
    ManifestStore,
    ManifestRepository,
  } from "@umbraco-cms/backoffice/extension-registry";
  
  export const WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS =
    "Umb.Repository.Workflow.ApprovalGroupItem";
  export const WORKFLOW_APPROVAL_GROUP_ITEM_STORE_ALIAS =
    "Umb.Store.Workflow.ApprovalGroupItem";
  
  const repository: ManifestRepository = {
    type: "repository",
    alias: WORKFLOW_APPROVAL_GROUP_ITEM_REPOSITORY_ALIAS,
    name: "Approval Group Item Repository",
    api: () => import('./approval-group-item.repository.js'),
  };
  
  const store: ManifestStore = {
    type: "store",
    alias: WORKFLOW_APPROVAL_GROUP_ITEM_STORE_ALIAS,
    name: "Approval Group Item Store",
    api: () => import('./approval-group-item.store.js'),
  };
  
  export const manifests = [repository, store];
  