import type { UmbAuditLogRequestArgs } from "@umbraco-cms/backoffice/audit-log";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { ReleaseSetsService } from "@umbraco-workflow/generated";
import {
  WorkflowAuditLogServerDataSourceBase,
  type WorkflowAuditLogServerDataSource,
} from "@umbraco-workflow/core";

export class ReleaseSetAuditLogServerDataSource
  extends WorkflowAuditLogServerDataSourceBase
  implements WorkflowAuditLogServerDataSource
{
  constructor(host: UmbControllerHost) {
    super(host);
  }

  async getAuditLog(args: UmbAuditLogRequestArgs) {
    return this.getAuditLogImpl(ReleaseSetsService.getReleaseSetByIdAuditLog, args);    
  }
}
