import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { WorkflowApprovalGroupsDetailRepository } from "../repository/detail/approval-groups-detail.repository.js";
import { WORKFLOW_CONFIRM_DELETE_GROUP_MODAL } from "../modal/index.js";

export class WorkflowDeleteGroupEntityAction extends UmbEntityActionBase<never> {
  async execute(): Promise<void> {
    if (!this.args.unique) throw new Error("unique is missing");

    const repository = new WorkflowApprovalGroupsDetailRepository(this);
    const { data, error } = await repository.requestByUnique(this.args.unique);

    if (!data || error) {
      throw new Error("group is missing");
    }

    const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

    const modalHandler = modalManager.open(
      this,
      WORKFLOW_CONFIRM_DELETE_GROUP_MODAL,
      {
        data: {
          groupName: data.name,
          unique: data.unique,
          repository: repository,
        },
      }
    );

    await modalHandler.onSubmit();
  }
}
