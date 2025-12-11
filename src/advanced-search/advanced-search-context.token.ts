import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WorkflowAdvancedSearchContext } from "./advanced-search.context.js";

export const WORKFLOW_ADVANCEDSEARCH_CONTEXT =
  new UmbContextToken<WorkflowAdvancedSearchContext>(
    "WorkflowAdvancedSearchContext"
  );
