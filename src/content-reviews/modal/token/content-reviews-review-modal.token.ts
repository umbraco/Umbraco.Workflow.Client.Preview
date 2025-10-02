import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL_ALIAS =
  "Workflow.Modal.ContentReviews.Review";

export interface WorkflowContentReviewsReviewModalData {}

export interface WorkflowContentReviewsReviewModalResult {
  reviewDate?: string;
}

export const WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL = new UmbModalToken<
  WorkflowContentReviewsReviewModalData,
  WorkflowContentReviewsReviewModalResult
>(WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "medium",
  },
});
