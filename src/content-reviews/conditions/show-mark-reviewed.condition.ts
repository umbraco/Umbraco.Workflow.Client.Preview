import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowDocumentWorkspaceVariantShowMarkReviewedCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      // show the action when the current user should review and node has no active workflow
      this.observe(context.scaffold, (scaffold) => {
        this.permitted =
          (scaffold?.review?.currentUserShouldReview ?? false) &&
          !scaffold?.tasks?.invariantTask;
      });
    });
  }
}

export { WorkflowDocumentWorkspaceVariantShowMarkReviewedCondition as api };
