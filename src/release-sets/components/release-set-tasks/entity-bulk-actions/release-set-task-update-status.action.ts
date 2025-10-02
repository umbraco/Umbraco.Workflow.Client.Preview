import type { UmbEntityBulkActionArgs } from "@umbraco-cms/backoffice/entity-bulk-action";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowReleaseSetUpdateStatusEntityBulkActionBase } from "../../release-set-update-status-entity-bulk-action-base.js";
import {
  ReleaseSetTaskStatusModel,
  type ReleaseSetTaskResponseModelReadable,
} from "@umbraco-workflow/generated";

export class WorkflowReleaseSetTaskUpdateStatusEntityBulkAction extends WorkflowReleaseSetUpdateStatusEntityBulkActionBase<ReleaseSetTaskResponseModelReadable>  {
  constructor(
    host: UmbControllerHost,
    args: UmbEntityBulkActionArgs<ReleaseSetTaskResponseModelReadable> 
  ) {
    super(
      host,
      args,
      ReleaseSetTaskStatusModel,
      (context) => context.tasks,
      (data, tasks) => data.update({ tasks })
    );
  }
}
