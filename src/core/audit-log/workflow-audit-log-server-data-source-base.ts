import type { DirectionModel } from "@umbraco-cms/backoffice/external/backend-api";
import type { UmbAuditLogRequestArgs } from "@umbraco-cms/backoffice/audit-log";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { RequestResult } from "@hey-api/client-fetch";
import type { WorkflowAuditLogModel, WorkflowAuditLogType } from "./types.js";
import type {
  GetVersionByIdAuditLogData,
  GetVersionByIdAuditLogResponses,
  Options,
  PagedAuditLogResponseModel,
} from "@umbraco-workflow/generated";

export class WorkflowAuditLogServerDataSourceBase {
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  // TODO => since date?
  async getAuditLogImpl<ThrowOnError extends boolean = true>(
    getter: (
      arg: Options<GetVersionByIdAuditLogData>
    ) => RequestResult<GetVersionByIdAuditLogResponses | undefined, unknown, ThrowOnError>,
    args: UmbAuditLogRequestArgs
  ) {
    const { data, error } = await tryExecute(
      this.#host,
      getter({
        path: { id: args.unique },
        query: {
          orderDirection: args.orderDirection as DirectionModel,
          // sinceDate: args.sinceDate,
          skip: args.skip,
          take: args.take,
        },
      })
    );

    if (data) {
      const mappedItems: Array<WorkflowAuditLogModel> = data.items.map(
        (item) => ({
          user: { unique: item.user.id },
          timestamp: item.timestamp,
          logType: item.logType as WorkflowAuditLogType,
          comment: item.comment,
          parameters: item.parameters,
        })
      );

      return { data: { items: mappedItems, total: data.total } };
    }

    return { error };
  }
}
