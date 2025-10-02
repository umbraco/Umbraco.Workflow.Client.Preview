import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";

export abstract class WorkflowRequestApprovalVisibilityConditionBase
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  protected workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  #invariantCulture = "*";

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.workflowManagerContext = context;
      this.#observeScaffold();
    });
  }

  #observeScaffold() {
    if (!this.workflowManagerContext) return;

    this.observe(this.workflowManagerContext.scaffold, (scaffold) => {
      if (this.workflowManagerContext?.getIsNew() || !scaffold) return;

      const config = scaffold.config;
      if (
        config &&
        ((!config.contentType.length &&
          !config.inherited.length &&
          !config.node.length) ||
          config.excluded ||
          config.locked)
      ) {
        this.permitted = false;
        return;
      }

      if (scaffold.review?.currentUserShouldReview) {
        this.permitted = false;
        return;
      }

      const tasks = scaffold.tasks;

      // document has no pending workflows for any variant
      if (!tasks?.variantTasks?.length && tasks?.invariantTask === null) {
        this.permitted = true;
        return;
      }

      let hasActiveWorkflow = false;
      if (
        tasks?.invariantTask?.instance?.variantCode === this.#invariantCulture
      ) {
        hasActiveWorkflow = true;
      } else {
        let culture =
          this.workflowManagerContext?.getActiveVariant() ??
          this.#invariantCulture;
        culture = culture === "invariant" ? this.#invariantCulture : culture;
        hasActiveWorkflow = scaffold.activeVariants.includes(culture);
      }

      this.permitted = !hasActiveWorkflow;
    });
  }
}
