import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../context/alternate-version-workspace.context-token.js";

export class WorkflowAlternateVersionDeleteVisibilityCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.permitted = context?.getData()?.sets.length === 0;
      }
    );
  }
}

export { WorkflowAlternateVersionDeleteVisibilityCondition as api };
