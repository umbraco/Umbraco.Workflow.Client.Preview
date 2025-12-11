import { WorkflowContentReviewsCollectionContext } from "./content-reviews-collection.context.js";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";

export const WORKFLOW_CONTENTREVIEWS_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowContentReviewsCollectionContext>(
    "UmbCollectionContext"
  );
