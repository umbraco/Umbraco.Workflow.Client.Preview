import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { ScaffoldArgsModel } from "@umbraco-workflow/context";
import { WorkflowReleaseSetWorkspaceContext } from "./workspace/release-set-workspace.context.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "./workspace/index.js";
import { RELEASESET_ENTITY_TYPE } from "./constants.js";
import {
  WorkflowEntityWorkflowInitializer,
  WorkflowInitializerBaseController,
} from "@umbraco-workflow/core";

export class WorkflowReleaseSetWorkflowInitializerController
  extends WorkflowInitializerBaseController<WorkflowReleaseSetWorkspaceContext>
  implements WorkflowEntityWorkflowInitializer
{
  constructor(host: UmbControllerHost, initializerArgs?: ScaffoldArgsModel) {
    super(host, WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, initializerArgs);
  }

  observeWorkspace() {
    if (!this.workspaceContext) return;

    this.observe(
      observeMultiple([
        this.workspaceContext.isNew,
        this.workspaceContext.unique,
      ]),
      ([isNew, unique]) => {
        if (!unique || isNew === undefined) return;

        this.setInitializerArgs({
          nodeKey: unique,
          isDashboard: false,
          isNew,
          entityType: RELEASESET_ENTITY_TYPE,
        });
      }
    );
  }

  getIsPublished() {
    return !!this.workspaceContext?.getData()?.updateDate;
  }

  getIsNew() {
    return this.workspaceContext?.getIsNew() !== false;
  }
}

export { WorkflowReleaseSetWorkflowInitializerController as api };
