import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export const WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL_ALIAS =
  "Workflow.Modal.ContentReviews.Regenerate";

export interface WorkflowContentReviewsRegenerateModalResult {
  relativeTo: 0 | 1;
  force: boolean;
}

export const WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL = new UmbModalToken<
  never,
  WorkflowContentReviewsRegenerateModalResult
>(WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL_ALIAS, {
  modal: {
    type: "dialog",
    size: "medium",
  },
});
