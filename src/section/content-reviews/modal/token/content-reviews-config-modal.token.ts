import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type {
  ContentReviewConfigItem,
  ContentReviewItem,
  ContentReviewType,
} from "../../types.js";
import type { LanguageModel } from "@umbraco-workflow/generated";

export const WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL_ALIAS =
  "Workflow.Modal.ContentReviews.Config";

export interface WorkflowContentReviewsConfigModalData {
  model: ContentReviewItem;
  isAdd: boolean;
  type: ContentReviewType;
  languages: Array<LanguageModel>;
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
