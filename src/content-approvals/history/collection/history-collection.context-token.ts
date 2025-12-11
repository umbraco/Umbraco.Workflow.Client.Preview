import { WorkflowHistoryCollectionContext } from "./history-collection.context.js";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

export const WORKFLOW_HISTORY_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowHistoryCollectionContext>("UmbCollectionContext");
