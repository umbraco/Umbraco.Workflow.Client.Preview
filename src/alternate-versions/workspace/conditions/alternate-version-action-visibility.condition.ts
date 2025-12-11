import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../context/alternate-version-workspace.context-token.js";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import { WorkflowAlternateVersionActionConditionConfig } from "./types.js";

export class WorkflowAlternateActionVisibilityCondition
  extends UmbConditionBase<WorkflowAlternateVersionActionConditionConfig>
  implements UmbExtensionCondition
{
  #hasNoActiveCultures?: boolean;
  #isValidStatus?: boolean;

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowAlternateVersionActionConditionConfig>
  ) {
    super(host, args);

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      this.observe(context?.scaffold, (scaffold) => {
        this.#hasNoActiveCultures = !scaffold?.activeCultures.length;
        this.#updatePermitted();
      });
    });

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.observe(context?.status, (status) => {
          this.#isValidStatus = status === this.config.status;
          this.#updatePermitted();
        });
      }
    );
  }

  #updatePermitted() {
    if (
      this.#hasNoActiveCultures !== undefined &&
      this.#isValidStatus !== undefined
    ) {
      this.permitted = this.#hasNoActiveCultures && this.#isValidStatus;
    }
  }
}

export { WorkflowAlternateActionVisibilityCondition as api };
