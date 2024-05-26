import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbItemRepositoryBase } from '@umbraco-cms/backoffice/repository';
import { WorkflowApprovalGroupItemServerDataSource } from './approval-group-item.server.data-source.js';
import { WORKFLOW_APPROVAL_GROUP_ITEM_STORE_CONTEXT } from './approval-group-item.store.js';
import type { ApprovalGroupItemModel } from './types.js';

export class WorkflowApprovalGroupItemRepository extends UmbItemRepositoryBase<ApprovalGroupItemModel> {
	constructor(host: UmbControllerHost) {
		super(host, WorkflowApprovalGroupItemServerDataSource, WORKFLOW_APPROVAL_GROUP_ITEM_STORE_CONTEXT);
	}
}

export default WorkflowApprovalGroupItemRepository;
