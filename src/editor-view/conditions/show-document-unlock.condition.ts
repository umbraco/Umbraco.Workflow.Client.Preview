import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import type {
  UmbConditionControllerArguments,
  UmbConditionConfigBase,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_SECTION_ALIAS } from "../../constants.js";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import { WorkflowReadonlyManagerController } from "@umbraco-workflow/core";

/**
 * Condition controls the button visibility for unlock as well as the actual readonly state for the variant
 * Readonly is for all users, button is for workflow admin only
 *
 * TODO => this does not respond to a change in scheduled date, need to find if there is a mechanism
 * for observing the scheduled date for the current variant
 */
export class WorkflowDocumentWorkspaceVariantShowDocumentUnlockCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  #readOnlyManager = new WorkflowReadonlyManagerController(
    this,
    "WORKFLOW_SCHEDULED_CONTENT_LOCK_",
    "workflow_lockedPendingRelease"
  );

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);


    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.scaffold, async (scaffold) => {
        if (!scaffold?.config) return;

        // locked if scheduled and setting is workflow|all, and no active workflow
        const locked =
          (scaffold.config?.locked ?? false) &&
          scaffold.activeVariants.length == 0;

        if (!locked) {
          this.#readOnlyManager.unlock();
          this.permitted = false;
          return;
        }

        this.#readOnlyManager.lock();

        const currentUserContext = await this.getContext(UMB_CURRENT_USER_CONTEXT);
        if (!currentUserContext) return;

        this.permitted = currentUserContext.getAllowedSection()?.includes(WORKFLOW_SECTION_ALIAS) ?? false;
      });
    });
  }
}

export { WorkflowDocumentWorkspaceVariantShowDocumentUnlockCondition as api };
