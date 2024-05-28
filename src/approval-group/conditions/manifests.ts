import type {
    ManifestCondition,
    UmbConditionConfigBase,
  } from "@umbraco-cms/backoffice/extension-api";
import { WorkflowApprovalGroupWorkspaceShowCreateGroupCondition } from './show-create-group.condition.js';
  
  export const WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION =
    "Workflow.Condition.ApprovalGroup.Workspace.ShowCreateGroup";  

  export type WorkflowApprovalGroupWorkspaceShowCreateGroupConditionConfig =
    UmbConditionConfigBase<
      typeof WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION
    >;
  
  const conditionManifests: Array<ManifestCondition> = [
    {
      type: "condition",
      name: "Approval Group Workspace Show Create Group Condition",
      alias: WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION,
      api: WorkflowApprovalGroupWorkspaceShowCreateGroupCondition,
    }
  ];
  
  export const manifests = [...conditionManifests];
  