import { WorkflowMyReviewsCollectionContext } from "./my-reviews-collection.context.js";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

export const WORKFLOW_MYREVIEWS_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowMyReviewsCollectionContext>(
    "UmbCollectionContext"
  );
