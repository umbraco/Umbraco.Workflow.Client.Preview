import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  ALTERNATEVERSION_ENTITY_TYPE,
  WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
  type WorkflowAlternateVersionWorkspaceContext,
} from "@umbraco-workflow/alternate-versions";
import type { ScaffoldArgsModel } from "@umbraco-workflow/context";
import {
  WorkflowEntityWorkflowInitializer,
  WorkflowInitializerBaseController,
} from "@umbraco-workflow/core";

export class WorkflowAlternateVersionWorkflowInitializerController
  extends WorkflowInitializerBaseController<WorkflowAlternateVersionWorkspaceContext>
  implements WorkflowEntityWorkflowInitializer
{
  constructor(host: UmbControllerHost, initializerArgs?: ScaffoldArgsModel) {
    super(host, WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT, initializerArgs);
  }

  observeWorkspace() {
    if (!this.workspaceContext) return;

    this.observe(
      observeMultiple([
        this.workspaceContext.isNew,
        this.workspaceContext.unique,
        this.workspaceContext.currentVariant,
      ]),
      ([isNew, unique, variant]) => {
        if (!unique || isNew === undefined) return;

        this.setInitializerArgs({
          nodeKey: unique,
          culture: variant?.toCultureString(),
          isDashboard: false,
          isNew,
          entityType: ALTERNATEVERSION_ENTITY_TYPE,
          parentKey: this.workspaceContext?.getParentUnique(),
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

export { WorkflowAlternateVersionWorkflowInitializerController as api };
