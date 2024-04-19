import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type { WorkflowApprovalGroupDetailModel } from "../types.js";
import { WorkflowApprovalGroupsDetailServerDataSource } from "./approval-groups.detail.server.data.js";
import { WORKFLOW_APPROVALGROUPS_STORE_CONTEXT } from "./approval-groups.store.js";
import { ApprovalGroupService } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupsRepository extends UmbDetailRepositoryBase<WorkflowApprovalGroupDetailModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowApprovalGroupsDetailServerDataSource,
      WORKFLOW_APPROVALGROUPS_STORE_CONTEXT
    );
  }

  // TODO => get slim
  async listSlim() {
    const { data, error } = await tryExecuteAndNotify(
      this,
      ApprovalGroupService.getApprovalGroupSlim({ skip: 0, take: 1000 })
    );

    return { data, error };
  }
}
