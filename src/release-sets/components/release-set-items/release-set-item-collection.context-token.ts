import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WorkflowReleaseSetItemCollectionContext } from "./release-set-item-collection.context.js";

export const WORKFLOW_RELEASESET_ITEM_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowReleaseSetItemCollectionContext>(
    "UmbCollectionContext"
  );
