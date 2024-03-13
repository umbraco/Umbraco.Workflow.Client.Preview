import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { WorkflowManagerContext } from './index.js';

export const WORKFLOW_MANAGER_CONTEXT =
  new UmbContextToken<WorkflowManagerContext>("workflow-manager-context");