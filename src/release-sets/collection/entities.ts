import type { WorkflowReleaseSetEntityType } from "../entities.js";
import type { ReleaseSetStatusModel } from "@umbraco-workflow/generated";

export interface WorkflowReleaseSetCollectionFilterModel {
  skip?: number;
  take?: number;
}

export interface WorkflowReleaseSetCollectionModel {
  entityType: WorkflowReleaseSetEntityType;
  name?: string | null;
  unique: string;
  icon: string;
  status: ReleaseSetStatusModel;
  description?: string;
  itemCount: number;
}
