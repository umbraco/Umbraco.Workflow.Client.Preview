import { UmbEntityBulkActionBase } from "@umbraco-cms/backoffice/entity-bulk-action";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../workspace/release-set-workspace.context-token.js";
import type { ReleaseSetVersionResponseModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetItemRemoveEntityBulkAction extends UmbEntityBulkActionBase<ReleaseSetVersionResponseModel> {
  async execute(): Promise<void> {

    const localize = new UmbLocalizationController(this);

    await umbConfirmModal(this._host, {
      headline: localize.term("actions_remove"),
      content: localize.term("workflow_alternateVersions_deleteItemDescription", this.selection.length),
      color: "danger",
      confirmLabel: localize.term("actions_remove"),
    }).catch(() => {});

    const workspaceContext = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );
    if (!workspaceContext) {
      throw new Error("Context not found: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT");
    }

    workspaceContext.removeItems(this.selection);
  }
}
