import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { WorkflowContext } from "./workflow-context.js";

export const WORKFLOW_CONTEXT =
  new UmbContextToken<WorkflowContext>("workflow-context");
