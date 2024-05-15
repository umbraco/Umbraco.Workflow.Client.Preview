import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { WorkflowFilterPickerContext } from './workflow-filterpicker-context.js';

export const WORKFLOW_FILTERPICKER_CONTEXT =
  new UmbContextToken<WorkflowFilterPickerContext>(
    "workflow-filterpicker-context"
  );
