import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import type {
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type { WorkflowUserPermissionConditionConfig } from "./types.js";

export class WorkflowUserPermissionCondition
  extends UmbConditionBase<WorkflowUserPermissionConditionConfig>
  implements UmbExtensionCondition
{
  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<WorkflowUserPermissionConditionConfig>
  ) {
    super(host, args);

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      this.observe(
        context?.currentUser,
        (currentUser) => this.#check(currentUser?.fallbackPermissions || []),
        Symbol()
      );
    });
  }

  #check(verbs: Array<string>) {
    if (this.config.match) {
      this.permitted = verbs.includes(this.config.match);
      return;
    }

    /* we default to true se we don't require both allOf and oneOf to be defined
		 but they can be combined for more complex scenarios */
    let allOfPermitted = true;
    let oneOfPermitted = true;

    // check if all of the verbs are present
    if (this.config.allOf?.length) {
      allOfPermitted = this.config.allOf.every((verb) => verbs.includes(verb));
    }

    // check if at least one of the verbs is present
    if (this.config.oneOf?.length) {
      oneOfPermitted = this.config.oneOf.some((verb) => verbs.includes(verb));
    }

    // if neither allOf or oneOf is defined we default to false
    if (!allOfPermitted && !oneOfPermitted) {
      allOfPermitted = false;
      oneOfPermitted = false;
    }

    this.permitted = allOfPermitted && oneOfPermitted;
  }
}

export { WorkflowUserPermissionCondition as api };
