import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowApprovalGroupWorkspaceContext } from "./approval-group-workspace.context.js";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../../constants.js";

export const WORKFLOW_APPROVALGROUP_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSubmittableWorkspaceContext,
  WorkflowApprovalGroupWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowApprovalGroupWorkspaceContext =>
    context.getEntityType() === WORKFLOW_APPROVALGROUP_ENTITY_TYPE
);
