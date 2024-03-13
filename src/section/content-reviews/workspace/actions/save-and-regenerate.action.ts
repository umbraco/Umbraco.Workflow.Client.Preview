import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type { UmbWorkspaceActionArgs} from "@umbraco-cms/backoffice/workspace";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT } from "../content-reviews-workspace.context-token.js";
import type { WorkflowContentReviewsRegenerateModalResult } from "../../modal/index.js";
import { WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL } from "../../modal/index.js";
import type { WorkflowContentReviewsWorkspaceContext } from "../content-reviews-workspace.context.js";

export class WorkflowRegenerateContentReviewsWorkspaceAction extends UmbWorkspaceActionBase<WorkflowContentReviewsWorkspaceContext> {

  constructor(
    host: UmbControllerHost,
    args: UmbWorkspaceActionArgs<WorkflowContentReviewsWorkspaceContext>
  ) {
    super(host, args);
  }

  async execute() {
    const workspaceContext = await this.getContext(WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT);
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

    if (!workspaceContext || !modalContext) return;

    const modalHandler = modalContext.open(
      this,
      WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL
    );

    const { relativeTo, force } =
      (await modalHandler.onSubmit()) as WorkflowContentReviewsRegenerateModalResult;

    workspaceContext.saveAndRegenerate(force, relativeTo);
  }
}
