import { UmbEntityBulkActionBase } from "@umbraco-cms/backoffice/entity-bulk-action";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { UMB_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { WorkflowReleaseSetsCollectionRepository } from '../repository/index.js';
import type { ReleaseSetCollectionResponseModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetCollectionDeleteBulkAction extends UmbEntityBulkActionBase<ReleaseSetCollectionResponseModel> {
  async execute(): Promise<void> {
    if (this.selection?.length === 0) return;

    const localize = new UmbLocalizationController(this);

    await umbConfirmModal(this._host, {
      headline: localize.term("actions_delete"),
      content: localize.term("workflow_alternateVersions_deleteVersionDescription", this.selection.length),
      color: "danger",
      confirmLabel: localize.term("actions_delete"),
    }).catch(() => {});

    const repository = new WorkflowReleaseSetsCollectionRepository(this);
    await repository.delete(this.selection);

    const collectionContext = await this.getContext(UMB_COLLECTION_CONTEXT);
    if (!collectionContext) {
      throw new Error("Context not found: UMB_COLLECTION_CONTEXT");
    }

    await collectionContext.requestCollection();
  }
}

export { WorkflowReleaseSetCollectionDeleteBulkAction as api };
