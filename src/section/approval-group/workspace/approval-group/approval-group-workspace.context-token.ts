import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSaveableWorkspaceContextInterface } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowApprovalGroupWorkspaceContext } from "./approval-group-workspace.context.js";

export const WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSaveableWorkspaceContextInterface,
  WorkflowApprovalGroupWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowApprovalGroupWorkspaceContext =>
    (context as WorkflowApprovalGroupWorkspaceContext)
      .IS_APPROVAL_GROUPS_WORKSPACE_CONTEXT
);
