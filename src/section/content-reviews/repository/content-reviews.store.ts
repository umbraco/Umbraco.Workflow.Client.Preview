import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowObjectStore } from "../../workflow-object-store.js";
import type { ContentReviewsConfigModel } from "@umbraco-workflow/generated";

export class ContentReviewsStore extends WorkflowObjectStore<ContentReviewsConfigModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_CONTENTREVIEWS_STORE_CONTEXT.toString());
  }
}

export const WORKFLOW_CONTENTREVIEWS_STORE_CONTEXT =
  new UmbContextToken<ContentReviewsStore>("ContentReviewsStore");
