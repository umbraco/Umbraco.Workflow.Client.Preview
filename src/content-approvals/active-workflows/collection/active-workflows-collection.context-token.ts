import { WorkflowActiveWorkflowsCollectionContext } from "./active-workflows-collection.context.js";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

export const WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowActiveWorkflowsCollectionContext>(
    "UmbCollectionContext"
  );
