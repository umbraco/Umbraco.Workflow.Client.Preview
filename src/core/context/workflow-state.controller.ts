import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { WorkflowState } from "./entities.js";
import { WORKFLOW_MANAGER_CONTEXT } from "./token/workflow-manager.context-token.js";
import { WORKFLOW_CONTEXT } from "./token/workflow.context-token.js";
import { UserActionsManagerController } from "./user-actions-manager.controller.js";
import type {
  GlobalWorkflowVariablesModel,
  WorkflowLicenseModel,
  WorkflowScaffoldResponseModelReadable,
} from "@umbraco-workflow/generated";

export class WorkflowStateController extends UmbControllerBase {
  state?: Partial<WorkflowState>;

  #scaffold?: WorkflowScaffoldResponseModelReadable;
  #globalVariables?: GlobalWorkflowVariablesModel;
  #license?: WorkflowLicenseModel;
  #actionsManager?: UserActionsManagerController;

  constructor(host: UmbControllerHost) {
    super(host);

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;
      this.#license = context.getLicense() ?? undefined;
      this.#globalVariables = context.getVariables();
    });

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.observe(context.scaffold, (scaffold) => {
        this.#scaffold = scaffold;
      });
    });
  }

  async generate(
    isDashboard?: boolean,
    isPublished?: boolean
  ): Promise<{ state: WorkflowState; valid: boolean }> {
    this.#actionsManager = new UserActionsManagerController(
      this,
      this.#globalVariables,
      this.#scaffold?.tasks?.invariantTask
    );

    const baseState = await this.#getBaseState(isDashboard);

    if (!this.#hasValidConfig(isPublished)) {
      return { state: baseState, valid: false };
    }

    return {
      state: { ...baseState, ...this.#buildConfigState() },
      valid: true,
    };
  }

  // base state still sets all properties, even if overwritten later,
  // this is so we don't return a partial, which prevents settings observable values
  async #getBaseState(isDashboard?: boolean): Promise<WorkflowState> {
    return {
      active: !!this.#scaffold?.tasks?.invariantTask,
      isDashboard,
      exclude: this.#scaffold?.config?.excluded ?? false,
      review: this.#scaffold?.review ?? undefined,
      user: await this.#actionsManager?.getUserActions(),
      allowAttachments: false,
      allowScheduling: false,
      requireComment: true,
      requireUnpublish: false,
      activeVariants: [],
      rejected: false,
      unique: "",
    };
  }

  #buildConfigState(): Partial<WorkflowState> {
    return {
      allowAttachments: this.#globalVariables?.allowAttachments ?? false,
      allowScheduling: this.#globalVariables?.allowScheduling ?? false,
      requireComment: this.#globalVariables?.mandatoryComments ?? true,
      requireUnpublish: this.#globalVariables?.requireUnpublish ?? false,
      activeVariants: this.#scaffold?.activeVariants ?? [],
      rejected: this.#actionsManager?.rejected ?? false,
      unique: this.#scaffold?.tasks?.invariantTask?.node?.key,
    };
  }

  /**
   * Trial license must have node or inherited config and !excluded for config to be valid
   * Other license types can have any of node, contentType or inherited, and !excluded
   */
  #hasValidConfig(isPublished?: boolean) {
    const validConfig =
      (this.#scaffold?.config?.node ?? []).length > 0 ||
      (this.#scaffold?.config?.inherited ?? []).length > 0 ||
      ((this.#scaffold?.config?.new ?? []).length > 0 && !isPublished);

    if (this.#license === undefined || this.#license.isTrial) {
      return validConfig;
    }

    return (
      validConfig || (this.#scaffold?.config?.contentType ?? []).length > 0
    );
  }
}
