import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { ManifestWorkspaceAction } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import {
  UmbWorkspaceActionBase,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";

import { WORKFLOW_SUBMIT_MODAL } from "@umbraco-workflow/editor-view";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowSubmitWorkflowWorkspaceAction extends UmbWorkspaceActionBase {
  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);
  }

  // async conn() {
  //   super.hostConnected();
  //   await this.#init;

  //   if (!this.#workflowGlobalContext) return;

  //   const observable = combineLatest({
  //     currentDocument: this.#workflowGlobalContext.currentDocument,
  //     registry: umbExtensionsRegistry.byTypeAndFilter(
  //       "workspaceAction",
  //       (ext) =>
  //         ext.conditions?.some(
  //           (c) => c["match"] === "Umb.Workspace.Document"
  //         ) ?? false
  //     ),
  //   }).pipe(take(1));

  //   this.#subscription.add(
  //     observable.subscribe({
  //       next: (value) => this.#setWorkspaceActions(value.registry),
  //     })
  //   );
  // }

  // hostDisconnected(): void {
  //   this.#subscription.unsubscribe();
  // }

  // TODO => we dont want to unregister the item, just not display it
  // assuming this will be possible when user permissions are implemented as
  // CMS must have logic for displaying save / save-and-publish / schedule etc
  #setWorkspaceActions(actions: Array<ManifestWorkspaceAction>) {
    const saveAndPublishAlias = "Umb.WorkspaceAction.Document.SaveAndPublish";
    // const fromCache = this.#workflowGlobalContext?.actionCache;
    // if (fromCache !== undefined) {
    //   umbExtensionsRegistry.registerMany(fromCache);
    // } else {
    //   this.#workflowGlobalContext?.cacheActions(
    //     actions.filter((a) => a.alias === saveAndPublishAlias)
    //   );
    // }

    // umbExtensionsRegistry.unregister(saveAndPublishAlias);
  }

  async execute() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const workflowContext = await this.getContext(WORKFLOW_CONTEXT);

    // TODO => user permissions will determine which buttons to display
    // for now, just removes save+publish and replaces with workflow init
    // refer to state.factory in workflow 13 for button logic examples

    if (!modalContext) return;

    const modalHandler = modalContext.open(this, WORKFLOW_SUBMIT_MODAL);
    await modalHandler!.onSubmit();
  }
}
