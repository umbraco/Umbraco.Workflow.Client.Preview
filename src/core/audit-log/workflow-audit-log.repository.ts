import type { UmbAuditLogRepository, UmbAuditLogRequestArgs } from '@umbraco-cms/backoffice/audit-log';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbRepositoryBase } from '@umbraco-cms/backoffice/repository';
import type { WorkflowAuditLogModel } from './types.js';
import type { WorkflowAuditLogServerDataSource, WorkflowAuditLogServerDataSourceConstructor } from './workflow-audit-log-server-data-source.js';

export class WorkflowAuditLogRepository
	extends UmbRepositoryBase
	implements UmbAuditLogRepository<WorkflowAuditLogModel>
{
	#dataSource: WorkflowAuditLogServerDataSource;

	constructor(host: UmbControllerHost, dataSource: WorkflowAuditLogServerDataSourceConstructor,
	) {
		super(host);
		this.#dataSource = new dataSource(host);
	}

	async requestAuditLog(args: UmbAuditLogRequestArgs) {
		return this.#dataSource.getAuditLog(args);
	}
}
