import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbItemStoreBase } from "@umbraco-cms/backoffice/store";
import type { ApprovalGroupItemModel } from './types.js';

export class WorkflowApprovalGroupItemStore extends UmbItemStoreBase<ApprovalGroupItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_APPROVAL_GROUP_ITEM_STORE_CONTEXT.toString());
  }
}

export default WorkflowApprovalGroupItemStore;

export const WORKFLOW_APPROVAL_GROUP_ITEM_STORE_CONTEXT =
  new UmbContextToken<WorkflowApprovalGroupItemStore>(
    "WorkflowApprovalGroupItemStore"
  );
