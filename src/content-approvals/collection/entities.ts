import { Options, RequestResult } from "@hey-api/client-fetch";
import {
  PostInstanceAllData,
  PostInstanceAllErrors,
  PostInstanceAllResponses,
  WorkflowInstanceTableResponseModel,
  WorkflowSearchRequestModel,
} from "@umbraco-workflow/generated";

export interface WorkflowInstancesCollectionModel
  extends WorkflowInstanceTableResponseModel {
  unique: string;
  entityType: string;
}

export interface WorkflowInstancesCollectionFilterModel
  extends WorkflowSearchRequestModel {
  handler?: (
    options?: Options<PostInstanceAllData, true>
  ) => RequestResult<PostInstanceAllResponses, PostInstanceAllErrors, true>;
}
