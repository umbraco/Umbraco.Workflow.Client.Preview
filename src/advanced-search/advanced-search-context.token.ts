import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WorkflowAdvancedSearchContext } from "./advanced-search.context.js";

export const ADVANCED_SEARCH_CONTEXT =
  new UmbContextToken<WorkflowAdvancedSearchContext>(
    "Workflow.AdvancedSearch.Context"
  );
