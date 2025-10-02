import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbWorkspaceContext } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowApprovableWorkspaceContext } from '../entities.js';

export const WORKFLOW_APPROVABLE_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbWorkspaceContext,
  WorkflowApprovableWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowApprovableWorkspaceContext =>
    (context as WorkflowApprovableWorkspaceContext)
      .IS_APPROVABLE_WORKSPACE_CONTEXT
);