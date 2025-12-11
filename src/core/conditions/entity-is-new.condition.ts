import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionControllerArguments,
  UmbConditionConfigBase,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_SUBMITTABLE_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/workspace";

export class WorkflowDocumentWorkspaceIsNewCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(UMB_SUBMITTABLE_WORKSPACE_CONTEXT, async (context) => {
      if (!context) return;

      this.observe(context.isNew, (isNew) => {
        this.permitted = isNew === false;
      });
    });
  }
}

export { WorkflowDocumentWorkspaceIsNewCondition as api };
