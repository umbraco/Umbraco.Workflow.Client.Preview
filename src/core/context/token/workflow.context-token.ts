import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { WorkflowContext } from "../context/workflow-context.js";

export const WORKFLOW_CONTEXT = new UmbContextToken<WorkflowContext>(
  "WorkflowContext"
);
