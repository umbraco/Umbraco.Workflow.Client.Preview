import type { UmbAuditLogRequestArgs } from "@umbraco-cms/backoffice/audit-log";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbDataSourceResponse, UmbPagedModel } from "@umbraco-cms/backoffice/repository";
import type { WorkflowAuditLogModel } from "./types.js";

export interface WorkflowAuditLogServerDataSourceConstructor {
  new (host: UmbControllerHost): WorkflowAuditLogServerDataSource;
}

export interface WorkflowAuditLogServerDataSource {
  getAuditLog(args: UmbAuditLogRequestArgs): Promise<UmbDataSourceResponse<UmbPagedModel<WorkflowAuditLogModel>>>;
}
