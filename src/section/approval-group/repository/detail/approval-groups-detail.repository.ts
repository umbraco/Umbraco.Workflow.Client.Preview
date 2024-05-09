import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type { WorkflowApprovalGroupDetailModel } from "../../types.js";
import { WorkflowApprovalGroupsDetailServerDataSource } from "./approval-groups-detail.server.data-source.js";
import { WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT } from "./approval-groups-detail.store.js";
import { ApprovalGroupService } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupsDetailRepository extends UmbDetailRepositoryBase<WorkflowApprovalGroupDetailModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowApprovalGroupsDetailServerDataSource,
      WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT
    );
  }

  async listSlim() {
    const { data, error } = await tryExecuteAndNotify(
      this,
      ApprovalGroupService.getApprovalGroupSlim({ skip: 0, take: 1000 })
    );

    return { data, error };
  }
}

export default WorkflowApprovalGroupsDetailRepository;