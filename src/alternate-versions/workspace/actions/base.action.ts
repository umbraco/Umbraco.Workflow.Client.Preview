import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbWorkspaceActionBase,
  type UmbSubmittableWorkspaceContext,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { UMB_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../context/alternate-version-workspace.context-token.js";

export abstract class AlternateVersionWorkspaceActionBase extends UmbWorkspaceActionBase<UmbSubmittableWorkspaceContext> {
  protected workspaceContext?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;
  protected documentWorkspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  protected localize = new UmbLocalizationController(this);

  constructor(
    host: UmbControllerHost,
    args: UmbWorkspaceActionArgs<UmbSubmittableWorkspaceContext>
  ) {
    super(host, args);
        
    this.consumeContext(UMB_COLLECTION_CONTEXT, context => {
      if (!context) return;
      context.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, workspaceContext => {
        this.documentWorkspaceContext = workspaceContext;
      })
    });

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.workspaceContext = context;
        this.#observeName();
      }
    );
  }

  #observeName() {
    if (!this.workspaceContext) {
      this.disable();
      return;
    }

    this.observe(this.workspaceContext.versionName, (versionName) => {
      // We can't save if we don't have a name
      if (!versionName) {
        this.disable();
      } else {
        this.enable();
      }
    });
  }
}
