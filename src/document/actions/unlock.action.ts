import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  UmbWorkspaceActionArgs,
  UmbWorkspaceActionBase,
} from "@umbraco-cms/backoffice/workspace";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { ConfigService } from "@umbraco-workflow/generated";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_DOCUMENT_UNLOCK_MODAL } from "../modal/index.js";

export class WorkflowDocumentUnlockWorkspaceAction extends UmbWorkspaceActionBase {
  #workflowManager?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;
  #documentWorkspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      this.#workflowManager = context;
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.#documentWorkspaceContext = context;
    });
  }

  async #unlock(args: {
    unique: string;
    publish: boolean;
    culture: string | null;
  }) {
    const { data } = await tryExecute(
      this,
      ConfigService.postConfigUnlock({
        body: args,
      })
    );

    if (!data) return;

    // when the response is true, the node has been unlocked and should be reloaded
    // to refresh the workflow state and remove the notifications/readonly mode
    this.#workflowManager?.refreshScaffold();
  }

  async execute() {
    if (!this.#documentWorkspaceContext) return;

    const publish = await umbOpenModal(this, WORKFLOW_DOCUMENT_UNLOCK_MODAL)
      .then((result) => result.publish)
      .catch(() => {});

    if (publish == null) return;

    this.observe(
      observeMultiple([
        this.#documentWorkspaceContext.varies,
        this.#documentWorkspaceContext.unique,
        this.#documentWorkspaceContext.splitView.activeVariantsInfo,
      ]),
      async ([varies, unique, activeVariant]) => {
        // varies emits once everything is loaded, so works as a guard
        if (varies === undefined || !activeVariant.length || !unique) return;

        await this.#unlock({
          unique,
          publish,
          culture: activeVariant[0].culture,
        });
      }
    );
  }
}

export { WorkflowDocumentUnlockWorkspaceAction as api };
