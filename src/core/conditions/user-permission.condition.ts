import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowUserPermissionConditionConfig } from "./types";

export class WorkflowUserPermissionCondition
  extends UmbConditionBase<WorkflowUserPermissionConditionConfig>
  implements UmbExtensionCondition
{
  #fallbackPermissions: string[] = [];

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowUserPermissionConditionConfig>
  ) {
    super(host, args);

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      this.observe(context?.currentUser, (currentUser) => {
        this.#fallbackPermissions = currentUser?.fallbackPermissions || [];
        this.#checkPermissions();
      });
    });
  }

  #checkPermissions() {
    if (this.config.match) {
      this.permitted = this.#fallbackPermissions.includes(this.config.match);
      return;
    }

    this.permitted =
      this.config.allOf?.every((verb) => this.#fallbackPermissions.includes(verb)) ??
      false;
  }
}

export { WorkflowUserPermissionCondition as api };
