import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowApprovalGroupsDetailServerDataSource } from "./approval-groups-detail.server.data-source.js";
import { WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT } from "./approval-groups-detail.store.js";
import type { ApprovalGroupDetailResponseModelReadable } from "@umbraco-workflow/generated";

export class WorkflowApprovalGroupsDetailRepository extends UmbDetailRepositoryBase<ApprovalGroupDetailResponseModelReadable> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowApprovalGroupsDetailServerDataSource,
      WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT
    );
  }
}

export default WorkflowApprovalGroupsDetailRepository;