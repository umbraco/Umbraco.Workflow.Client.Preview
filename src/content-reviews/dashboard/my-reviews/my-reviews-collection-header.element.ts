import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowCollectionHeaderBaseElement } from "@umbraco-workflow/core";
import {
  WORKFLOW_CONTENTREVIEWS_COLLECTION_CONTEXT,
  WorkflowContentReviewsCollectionContext,
} from "../../collection/index.js";

const elementName = "workflow-my-reviews-collection-header";

@customElement(elementName)
export class WorkflowMyReviewsCollectionHeaderElement extends WorkflowCollectionHeaderBaseElement<WorkflowContentReviewsCollectionContext> {
  constructor() {
    super({
      contextToken: WORKFLOW_CONTENTREVIEWS_COLLECTION_CONTEXT,
      title: "workflow_contentReviews_staleContent",
    });
  }
}

export default WorkflowMyReviewsCollectionHeaderElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowMyReviewsCollectionHeaderElement;
  }
}
