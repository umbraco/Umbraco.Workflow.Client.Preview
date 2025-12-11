import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_CONTENTREVIEWS_COLLECTION_CONTEXT } from "./content-reviews-collection.context-token.js";
import { WorkflowCollectionHeaderBaseElement } from "@umbraco-workflow/content-approvals";
import { WorkflowContentReviewsCollectionContext } from "./content-reviews-collection.context.js";
import { ContentReviewFilters } from "@umbraco-workflow/components";

const elementName = "workflow-content-reviews-collection-header";

@customElement(elementName)
export class WorkflowContentReviewsCollectionHeaderElement extends WorkflowCollectionHeaderBaseElement<WorkflowContentReviewsCollectionContext> {
  constructor() {
    super({
      filter: new ContentReviewFilters(undefined, ["status", "completedDate"]),
      contextToken: WORKFLOW_CONTENTREVIEWS_COLLECTION_CONTEXT,
      onFilterChange: (filters) =>
        this.collectionContext?.setFilter({ filters }),
    });
  }
}

export default WorkflowContentReviewsCollectionHeaderElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsCollectionHeaderElement;
  }
}
