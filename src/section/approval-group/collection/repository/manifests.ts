import type { ManifestRepository } from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowApprovalGroupCollectionRepository } from "./approval-group-collection.repository.js";

export const WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS =
  "Umb.Workflow.Repository.ApprovalGroup.Collection";

const repository: ManifestRepository = {
  type: "repository",
  alias: WORKFLOW_APPROVALGROUP_COLLECTION_REPOSITORY_ALIAS,
  name: "Workflow Approval Group Collection Repository",
  api: WorkflowApprovalGroupCollectionRepository,
};

export const manifests = [repository];
