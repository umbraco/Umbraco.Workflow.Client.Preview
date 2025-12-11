import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowReadonlyManagerController } from "../readonly-manager.controller.js";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowDetailVisibilityCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  #managerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  #readOnlyManager = new WorkflowReadonlyManagerController(
    this,
    "WORKFLOW_ACTIVE_CONTENT_LOCK_",
    "workflow_docIsActive"
  );

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.#managerContext = context;

      this.#observeScaffold();
      this.#observeState();
    });
  }

  #observeScaffold() {
    if (!this.#managerContext) return;

    this.observe(this.#managerContext.scaffold, (scaffold) => {
      if (!scaffold) return;

      const culture = this.#managerContext!.getActiveCulture();

      this.permitted =
        (scaffold?.activeCultures?.includes(
          this.#managerContext!.invariantCulture
        ) ||
          scaffold?.activeCultures?.includes(culture)) ??
        false;
    });
  }

  #observeState() {
    this.observe(this.#managerContext?.state, (state) => {
      if (!state) return;
      // always unlock unless canEdit is explicitly set
      if (
        state.user?.canEdit ||
        !Object.hasOwnProperty.call(state.user ?? {}, "canEdit")
      ) {
        this.#readOnlyManager.unlock();
        return;
      }
      this.#readOnlyManager.lock();
    });
  }
}

export { WorkflowDetailVisibilityCondition as api };
