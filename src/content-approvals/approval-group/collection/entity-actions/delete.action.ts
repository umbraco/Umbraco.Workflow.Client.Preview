import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { UMB_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_CONFIRM_DELETE_GROUP_MODAL } from "../../modal/index.js";

export class WorkflowDeleteGroupEntityAction extends UmbEntityActionBase<never> {
  async execute() {
    if (!this.args.unique) throw new Error("unique is missing");

    const collectionContext = await this.getContext(UMB_COLLECTION_CONTEXT);

    const group = collectionContext
      ?.getItems()
      .find((x) => x.unique === this.args.unique);

    if (!group) return;

    await umbOpenModal(this, WORKFLOW_CONFIRM_DELETE_GROUP_MODAL, {
      data: {
        groupName: group.name,
        unique: group.unique,
      },
    }).catch(() => {});

    collectionContext?.requestCollection();
  }
}

export { WorkflowDeleteGroupEntityAction as api };
