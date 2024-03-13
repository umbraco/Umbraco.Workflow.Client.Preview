import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbCollectionRepository } from '@umbraco-cms/backoffice/collection';
import type { WorkflowApprovalGroupCollectionFilterModel } from '../types.js';
import { WorkflowApprovalGroupCollectionServerDataSource } from './approval-group-collection.server.data-source.js';

export class WorkflowApprovalGroupCollectionRepository implements UmbCollectionRepository {
	#collectionSource: WorkflowApprovalGroupCollectionServerDataSource;

	constructor(host: UmbControllerHost) {
		this.#collectionSource = new WorkflowApprovalGroupCollectionServerDataSource(host);
	}

	async requestCollection(filter: WorkflowApprovalGroupCollectionFilterModel) {
		return this.#collectionSource.getCollection(filter);
	}

	destroy(): void {}
}

export default WorkflowApprovalGroupCollectionRepository;
