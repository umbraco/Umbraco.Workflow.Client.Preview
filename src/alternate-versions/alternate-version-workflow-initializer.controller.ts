import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowInitializerBaseController } from "../core/initializers/workflow-initializer-base.controller.js";
import type { WorkflowEntityWorkflowInitializer } from "../core/initializers/entity-workflow-initializer.manifest.js";
import {
  ALTERNATEVERSION_ENTITY_TYPE,
  WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
  type WorkflowAlternateVersionWorkspaceContext,
} from "@umbraco-workflow/alternate-versions";
import type { ScaffoldArgsModel } from "@umbraco-workflow/context";

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
          variant: variant?.toString(),
          isDashboard: false,
          isNew,
          entityType: ALTERNATEVERSION_ENTITY_TYPE,
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
