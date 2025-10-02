import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import {
  UmbWorkspaceActionBase,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT } from "../content-reviews-workspace.context-token.js";
import { WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL } from "../../modal/index.js";

import type { WorkflowContentReviewsWorkspaceContext } from "../content-reviews-workspace.context.js";

export class WorkflowRegenerateContentReviewsWorkspaceAction extends UmbWorkspaceActionBase<WorkflowContentReviewsWorkspaceContext> {
  async execute() {
    const workspaceContext = await this.getContext(
      WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT
    );
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

    if (!workspaceContext || !modalContext) return;

    const modalHandler = modalContext.open(
      this,
      WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL
    );

    await modalHandler.onSubmit().catch(() => undefined);
    const { relativeTo, force } = modalHandler.getValue();

    workspaceContext.saveAndRegenerate(force, +relativeTo);
  }
}

export { WorkflowRegenerateContentReviewsWorkspaceAction as api };
