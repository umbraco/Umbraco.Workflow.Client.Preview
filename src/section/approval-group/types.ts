export const WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE = "approval-group-root";
export const WORKFLOW_APPROVALGROUP_ENTITY_TYPE = "approval-group";

export type WorkflowApprovalGroupEntityType =
  typeof WORKFLOW_APPROVALGROUP_ENTITY_TYPE;
export type WorkflowApprovalGroupRootEntityType =
  typeof WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE;

export interface WorkflowApprovalGroupDetailModel {
  unique: string;
  entityType: WorkflowApprovalGroupEntityType;
  name: string;
  alias: string;
  icon: string;
  users: Array<WorkflowUserModel>;
  properties: Array<WorkflowPropertyModel>;
  permissions: Array<WorkflowPermissionModel>;
  inheritMembers: string;
}

export interface WorkflowConfigType {
  alias: string;
  value?: any;
}

export interface WorkflowPropertyModel {
  alias: string;
  label: string;
  description: string;
  editorUiAlias: string;
  value?: any;
  readonly: boolean;
  hidden: boolean;
  config?: Array<WorkflowConfigType>;
}

export interface WorkflowPermissionModel {
  groupId: number;
  nodeId: number;
  contentTypeId: number;
  nodeName?: string | null;
  contentTypeName?: string | null;
  permission: number;
}

export interface WorkflowUserModel {
  name?: string | null;
  userId: string;
  groupId: string;
  isActive: boolean;
  inherited: boolean;
}
