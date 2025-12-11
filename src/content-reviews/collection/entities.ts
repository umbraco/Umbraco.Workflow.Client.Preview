import {
  ContentReviewCollectionResponseModel,
  WorkflowSearchRequestModel,
} from "@umbraco-workflow/generated";

export interface WorkflowContentReviewsCollectionModel
  extends ContentReviewCollectionResponseModel {
  unique: string;
  entityType: string;
}

export interface WorkflowContentReviewsCollectionFilterModel
  extends WorkflowSearchRequestModel {}
