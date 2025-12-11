import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type {
  ContentReviewConfigItem,
  ContentReviewItem,
  ContentReviewType,
} from "../../../entities.js";

export const WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL_ALIAS =
  "Workflow.Modal.ContentReviews.Config";

export interface WorkflowContentReviewsConfigModalData {
  model: ContentReviewItem;
  isAdd: boolean;
  type: ContentReviewType;
}

export interface WorkflowContentReviewsConfigModalResult {
  configItems: Array<ContentReviewConfigItem>;
}

export const WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL = new UmbModalToken<
  WorkflowContentReviewsConfigModalData,
  WorkflowContentReviewsConfigModalResult
>(WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
