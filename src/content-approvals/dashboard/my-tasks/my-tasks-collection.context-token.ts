import { WorkflowMyTasksCollectionContext } from "./my-tasks-collection.context.js";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

export const WORKFLOW_MYTASKS_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowMyTasksCollectionContext>("UmbCollectionContext");
