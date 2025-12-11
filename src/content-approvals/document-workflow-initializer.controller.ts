import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UMB_DOCUMENT_ENTITY_TYPE,
  UMB_DOCUMENT_WORKSPACE_CONTEXT,
  type UmbDocumentWorkspaceContext,
} from "@umbraco-cms/backoffice/document";
import {
  observeMultiple,
  UmbObserverController,
} from "@umbraco-cms/backoffice/observable-api";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import {
  WORKFLOW_INVARIANT,
  WorkflowEntityWorkflowInitializer,
  WorkflowInitializerBaseController,
} from "@umbraco-workflow/core";
import type { ScaffoldArgsModel } from "@umbraco-workflow/context";

export class WorkflowDocumentWorkflowInitializerController
  extends WorkflowInitializerBaseController<UmbDocumentWorkspaceContext>
  implements WorkflowEntityWorkflowInitializer
{
  #activeCulture?: string;
  #observer?: UmbObserverController;

  constructor(host: UmbControllerHost, initializerArgs?: ScaffoldArgsModel) {
    super(host, UMB_DOCUMENT_WORKSPACE_CONTEXT, initializerArgs);
  }

  observeWorkspace() {
    if (!this.workspaceContext) return;

    this.#observer?.destroy();
    this.#observer = this.observe(
      observeMultiple([
        this.workspaceContext.isNew,
        this.workspaceContext.varies,
        this.workspaceContext.unique,
        this.workspaceContext.splitView.activeVariantsInfo,
      ]),
      async ([isNew, varies, unique, activeVariant]) => {
        if (varies === undefined || isNew === undefined) return;
        if (!activeVariant.length || !unique) return;

        const culture = activeVariant.at(0)?.culture ?? WORKFLOW_INVARIANT;
        if (varies && culture === WORKFLOW_INVARIANT) return;
        if (!varies && culture !== WORKFLOW_INVARIANT) return;

        this.#activeCulture = culture;

        this.setInitializerArgs({
          nodeKey: unique.toString(),
          culture: this.#activeCulture,
          isDashboard: false,
          isNew,
          entityType: UMB_DOCUMENT_ENTITY_TYPE,
        });
      }
    );
  }

  getIsPublished() {
    return !!this.#getVariant()?.publishDate;
  }

  getIsNew() {
    return this.workspaceContext?.getIsNew() !== false;
  }

  #getVariant() {
    return this.workspaceContext?.getVariant(
      new UmbVariantId(this.#activeCulture)
    );
  }
}

export { WorkflowDocumentWorkflowInitializerController as api };
