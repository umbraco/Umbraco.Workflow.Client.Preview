import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import type { WorkflowApprovalGroupCollectionModel } from '../../collection/types.js';

export class WorkflowApprovalGroupsDetailStore extends UmbDetailStoreBase<WorkflowApprovalGroupCollectionModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT.toString());
  }
}

export default WorkflowApprovalGroupsDetailStore;

export const WORKFLOW_APPROVALGROUPS_DETAIL_STORE_CONTEXT =
  new UmbContextToken<WorkflowApprovalGroupsDetailStore>(
    "WorkflowApprovalGroupsDetailStore"
  );