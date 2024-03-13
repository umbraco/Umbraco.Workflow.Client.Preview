import type { ManifestRepository } from "@umbraco-cms/backoffice/extension-registry";
import type { ManifestWorkflowObjectStore } from "../../workflow-object-store.js";
import { WorkflowContentReviewsRepository } from "./content-reviews.repository.js";
import { ContentReviewsStore } from "./content-reviews.store.js";

export const WORKFLOW_CONTENTREVIEWS_REPOSITORY_ALIAS =
  "Umb.Repository.Workflow.ContentReviews";

export const WORKFLOW_CONTENTREVIEWS_STORE_ALIAS =
  "Umb.Store.Workflow.ContentReviews";

const repository: ManifestRepository = {
  type: "repository",
  alias: WORKFLOW_CONTENTREVIEWS_REPOSITORY_ALIAS,
  name: "Workflow Content Reviews Repository",
  api: WorkflowContentReviewsRepository,
};

const store: ManifestWorkflowObjectStore = {
  type: "workflowObjectStore",
  alias: WORKFLOW_CONTENTREVIEWS_STORE_ALIAS,
  name: "Workflow Content Reviews Settings Store",
  api: ContentReviewsStore,
};

export const manifests = [repository, store];
