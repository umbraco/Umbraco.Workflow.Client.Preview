import type { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../constants.js";
import type {
  ApprovalGroupCollectionMemberResponseModel,
  ApprovalGroupDetailPermissionResponseModel,
} from "@umbraco-workflow/generated";

export interface WorkflowApprovalGroupCollectionFilterModel {
  skip?: number;
  take?: number;
}

export interface WorkflowApprovalGroupCollectionModel {
  entityType: typeof WORKFLOW_APPROVALGROUP_ENTITY_TYPE;
  name: string;
  unique: string;
  icon: string;
  members: Array<ApprovalGroupCollectionMemberResponseModel>;
  permissions: Array<ApprovalGroupDetailPermissionResponseModel>;
  groupEmail?: string;
}
