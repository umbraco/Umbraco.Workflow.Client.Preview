import { UmbConditionConfigBase } from "@umbraco-cms/backoffice/extension-api";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "./constants";

export type WorkflowUserPermissionConditionConfig =
  UmbConditionConfigBase<
    typeof WORKFLOW_USER_PERMISSION_CONDITION_ALIAS
  > & {
    match?: string;
    allOf?: Array<string>;
  };

declare global {
  interface UmbExtensionConditionConfigMap {
    workflowUserPermissionConditionConfig: WorkflowUserPermissionConditionConfig;
  }
}
