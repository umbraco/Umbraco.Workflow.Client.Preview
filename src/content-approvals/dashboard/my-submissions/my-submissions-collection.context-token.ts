import { WorkflowMySubmissionsCollectionContext } from "./my-submissions-collection.context.js";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

export const WORKFLOW_MYSUBMISSIONS_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowMySubmissionsCollectionContext>(
    "UmbCollectionContext"
  );
