import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowRequestApprovalVisibilityCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  protected workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

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
      if (!scaffold?.config) return;

      const config = scaffold.config;
      if (config.excluded || config.locked) {
        this.permitted = false;
        return;
      }

      const tasks = scaffold.tasks;
      let noPendingWorkflows = false;

      // document has no pending workflows for any variant
      if (!tasks?.variantTasks?.length && tasks?.invariantTask === null) {
        noPendingWorkflows = true;
      }

      // New nodes with config.new permissions are permitted regardless of other config
      // Checks isPublished rather than isNew as isNew is only true until first save.
      const unpublished =
        this.workflowManagerContext?.getIsPublished() === false;
      if (unpublished && config.new.length && noPendingWorkflows) {
        this.permitted = true;
        return;
      }

      if (
        !config.contentType.length &&
        !config.inherited.length &&
        !config.node.length
      ) {
        this.permitted = false;
        return;
      }

      if (scaffold.review?.currentUserShouldReview) {
        this.permitted = false;
        return;
      }

      // document has no pending workflows for any variant
      if (noPendingWorkflows) {
        this.permitted = true;
        return;
      }

      let hasActiveWorkflow = false;
      if (
        tasks?.invariantTask?.instance?.cultureCode ===
        this.workflowManagerContext!.invariantCulture
      ) {
        hasActiveWorkflow = true;
      } else {
        const culture = this.workflowManagerContext!.getActiveCulture();
        hasActiveWorkflow = scaffold.activeCultures.includes(culture);
      }

      this.permitted = !hasActiveWorkflow;
    });
  }
}

export { WorkflowRequestApprovalVisibilityCondition as api };
