import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type {
  UmbConditionConfigBase,
  UmbConditionControllerArguments,
  UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../context/alternate-version-workspace.context-token.js";
import { AlternateVersionStatusModel } from "@umbraco-workflow/generated";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE } from "src/alternate-versions/user-permissions/constants.js";

export class WorkflowAlternateVersionMakeCurrentVisibilityCondition
  extends UmbConditionBase<UmbConditionConfigBase>
  implements UmbExtensionCondition
{
  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<UmbConditionConfigBase>
  ) {
    super(host, args);

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      async (context) => {
        if (!context) return;

        const currentUserContext = await this.getContext(
          UMB_CURRENT_USER_CONTEXT
        );

        const fallbackPermissions =
          currentUserContext?.getFallbackPermissions() ?? [];

          this.observe(
          context.data.asObservablePart((d) => d?.status),
          (status) => {
            this.permitted =
              status === AlternateVersionStatusModel.READY_TO_PUBLISH ||
              fallbackPermissions?.includes(
                WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_PROMOTE
              );
          }
        );
      }
    );
  }
}

export { WorkflowAlternateVersionMakeCurrentVisibilityCondition as api };
