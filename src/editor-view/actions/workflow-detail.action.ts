import {
  UMB_DOCUMENT_WORKSPACE_CONTEXT,
} from "@umbraco-cms/backoffice/document";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type { UmbWorkspaceActionArgs} from "@umbraco-cms/backoffice/workspace";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_DETAIL_MODAL } from "../modal/index.js";

export class WorkflowDetailWorkspaceAction extends UmbWorkspaceActionBase {
  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);
  }

  async execute() {
    const workspaceContext = await this.getContext(
      UMB_DOCUMENT_WORKSPACE_CONTEXT
    );
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

    if (!workspaceContext || !modalContext) return;

    const modalHandler = modalContext.open(this, WORKFLOW_DETAIL_MODAL, {
      data: {
        unique: workspaceContext.getUnique(),
        contentTypeId: workspaceContext.getContentTypeId(),
        isDashboard: false,
      },
    });

    await modalHandler!.onSubmit();
  }
}
