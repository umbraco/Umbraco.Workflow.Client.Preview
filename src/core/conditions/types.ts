import type { UmbConditionConfigBase } from "@umbraco-cms/backoffice/extension-api";
import type {
  WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS,
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
} from "./constants.js";
import { GlobalWorkflowVariablesModel } from "@umbraco-workflow/generated";

type WorkflowConditionConfigBase<MatchType = string> = {
  match?: string;
  allOf?: Array<MatchType>;
  oneOf?: Array<MatchType>;
};

export type WorkflowUserPermissionConditionConfig = UmbConditionConfigBase<
  typeof WORKFLOW_USER_PERMISSION_CONDITION_ALIAS
> &
  WorkflowConditionConfigBase<string>;

export type WorkflowSettingEnabledConditionConfig = UmbConditionConfigBase<
  typeof WORKFLOW_SETTING_ENABLED_CONDITION_ALIAS
> &
  WorkflowConditionConfigBase<keyof GlobalWorkflowVariablesModel>;

declare global {
  interface UmbExtensionConditionConfigMap {
    WorkflowUserPermissionConditionConfig: WorkflowUserPermissionConditionConfig;
    WorkflowSettingIsTrueConditionConfig: WorkflowSettingEnabledConditionConfig;
  }
}
