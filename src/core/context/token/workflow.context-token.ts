import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { WorkflowContext } from "../context/workflow-context.js";

export const WORKFLOW_CONTEXT_ALIAS = "WorkflowContext";

export const WORKFLOW_CONTEXT = new UmbContextToken<WorkflowContext>(
  WORKFLOW_CONTEXT_ALIAS
);
