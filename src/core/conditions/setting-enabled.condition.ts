import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import { GlobalWorkflowVariablesModel } from "@umbraco-workflow/generated";
import { WorkflowSettingEnabledConditionConfig } from "./types.js";

export class WorkflowSettingEnabledCondition
  extends UmbConditionBase<WorkflowSettingEnabledConditionConfig>
  implements UmbExtensionCondition
{
  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowSettingEnabledConditionConfig>
  ) {
    super(host, args);

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this.observe(context?.globalVariables, (data) => {
        this.permitted = this.#check(data);
      });
    });
  }

  #check(data?: GlobalWorkflowVariablesModel) {
    if (!data) return false;

    if (this.config.match) {
      return data[this.config.match] ?? false;
    }

    if (this.config.oneOf) {
      return this.config.oneOf.some((x) => data[x] === true);
    }

    if (this.config.allOf) {
      return this.config.allOf.every((x) => data[x] === true);
    }

    return false;
  }
}

export { WorkflowSettingEnabledCondition as api };
