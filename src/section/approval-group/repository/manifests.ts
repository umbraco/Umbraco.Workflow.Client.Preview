import type {
  ManifestStore,
  ManifestRepository,
} from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowApprovalGroupsStore } from "./approval-groups.store.js";
import { WorkflowApprovalGroupsRepository } from "./approval-groups.repository.js";

export const WORKFLOW_APPROVAL_GROUPS_REPOSITORY_ALIAS =
  "Umb.Repository.Workflow.ApprovalGroups";
export const WORKFLOW_APPROVAL_GROUPS_STORE_ALIAS =
  "Umb.Store.Workflow.ApprovalGroups";

const repository: ManifestRepository = {
  type: "repository",
  alias: WORKFLOW_APPROVAL_GROUPS_REPOSITORY_ALIAS,
  name: "Approval Groups Repository",
  api: WorkflowApprovalGroupsRepository,
};

const store: ManifestStore = {
  type: "store",
  alias: WORKFLOW_APPROVAL_GROUPS_STORE_ALIAS,
  name: "Approval Groups Store",
  api: WorkflowApprovalGroupsStore,
};

export const manifests = [repository, store];
