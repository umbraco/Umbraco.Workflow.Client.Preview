import type { WorkflowApprovalGroupEntityType } from "../types.js";
import type { UserGroupPermissionsModel } from "@umbraco-workflow/generated";

export interface WorkflowApprovalGroupCollectionFilterModel {
  skip?: number;
  take?: number;
}

export interface WorkflowApprovalGroupCollectionModel {
  entityType: WorkflowApprovalGroupEntityType;
  name: string;
  unique: string;
  groupEmail?: string;
  icon: string;
  users: Array<{ name: string; inherited: boolean; email?: string }>;
  permissions: Array<UserGroupPermissionsModel>;
  languageCount: number;
}
