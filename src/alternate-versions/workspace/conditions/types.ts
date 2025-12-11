import { UmbConditionConfigBase } from "@umbraco-cms/backoffice/extension-api";
import { ALTERNATEVERSION_ACTION_VISIBILITY_CONDITION_ALIAS } from "./constants";
import { AlternateVersionStatusModel } from "generated/types.gen";

export type WorkflowAlternateVersionActionConditionConfig =
  UmbConditionConfigBase<
    typeof ALTERNATEVERSION_ACTION_VISIBILITY_CONDITION_ALIAS
  > & {
    status: AlternateVersionStatusModel;
  };

declare global {
  interface UmbExtensionConditionConfigMap {
    WorkflowAlternateVersionActionConditionConfig: WorkflowAlternateVersionActionConditionConfig;
  }
}
