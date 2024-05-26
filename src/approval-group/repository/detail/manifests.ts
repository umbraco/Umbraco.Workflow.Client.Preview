import type {
  ManifestStore,
  ManifestRepository,
} from "@umbraco-cms/backoffice/extension-registry";

export const WORKFLOW_APPROVAL_GROUPS_DETAIL_REPOSITORY_ALIAS =
  "Umb.Repository.Workflow.ApprovalGroupsDetail";
export const WORKFLOW_APPROVAL_GROUPS_DETAIL_STORE_ALIAS =
  "Umb.Store.Workflow.ApprovalGroupsDetail";

const repository: ManifestRepository = {
  type: "repository",
  alias: WORKFLOW_APPROVAL_GROUPS_DETAIL_REPOSITORY_ALIAS,
  name: "Approval Groups Detail Repository",
  api: () => import('./approval-groups-detail.repository.js'),
};

const store: ManifestStore = {
  type: "store",
  alias: WORKFLOW_APPROVAL_GROUPS_DETAIL_STORE_ALIAS,
  name: "Approval Groups Detail Store",
  api: () => import('./approval-groups-detail.store.js'),
};

export const manifests = [repository, store];
