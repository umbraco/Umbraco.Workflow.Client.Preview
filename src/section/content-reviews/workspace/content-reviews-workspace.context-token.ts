import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbSaveableWorkspaceContextInterface } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowContentReviewsWorkspaceContext } from './content-reviews-workspace.context.js';

export const WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT = new UmbContextToken<
  UmbSaveableWorkspaceContextInterface,
  WorkflowContentReviewsWorkspaceContext
>(
  "UmbWorkspaceContext",
  undefined,
  (context): context is WorkflowContentReviewsWorkspaceContext =>
    (context as WorkflowContentReviewsWorkspaceContext).IS_CONTENT_REVIEWS_WORKSPACE_CONTEXT
);
