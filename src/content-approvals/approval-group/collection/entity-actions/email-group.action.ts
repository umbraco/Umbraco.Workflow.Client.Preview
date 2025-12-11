import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import {
  UMB_COLLECTION_CONTEXT,
  UmbDefaultCollectionContext,
} from "@umbraco-cms/backoffice/collection";
import { WorkflowApprovalGroupCollectionModel } from "../index.js";

export class WorkflowEmailGroupEntityAction extends UmbEntityActionBase<never> {
  async getHref(): Promise<string | undefined> {
    if (!this.args.unique) throw new Error("unique is missing");

    const collectionContext = await this.getContext<
      UmbDefaultCollectionContext<WorkflowApprovalGroupCollectionModel, any>
    >(UMB_COLLECTION_CONTEXT);

    if (!collectionContext) return;

    const group = collectionContext
      .getItems()
      .find((x) => x.unique === this.args.unique);

    if (!group) return;

    if (group.groupEmail) {
      return `mailto:${group.groupEmail}`;
    }

    return `mailto:${group.members
      .map((v) => v.email)
      .filter((x) => x)
      .join(";")}`;
  }
}

export default WorkflowEmailGroupEntityAction;
