import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbWorkspaceActionBase } from "@umbraco-cms/backoffice/workspace";
import type { WorkflowContentReviewsSettingsWorkspaceContext } from "../content-reviews-settings-workspace.context.js";
import { WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT } from "../content-reviews-settings-workspace.context-token.js";
import { WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL } from "../../modal/index.js";

export class WorkflowRegenerateContentReviewsWorkspaceAction extends UmbWorkspaceActionBase<WorkflowContentReviewsSettingsWorkspaceContext> {
  async execute() {
    const workspaceContext = await this.getContext(
      WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT
    );

    if (!workspaceContext) return;

    const result = await umbOpenModal(
      this,
      WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL
    ).catch(() => {});

    if (!result) return;

    workspaceContext.saveAndRegenerate(result.force, result.relativeTo);
  }
}

export { WorkflowRegenerateContentReviewsWorkspaceAction as api };
