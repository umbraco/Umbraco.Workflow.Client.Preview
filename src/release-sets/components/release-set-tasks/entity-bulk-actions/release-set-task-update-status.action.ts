import type { UmbEntityBulkActionArgs } from "@umbraco-cms/backoffice/entity-bulk-action";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowReleaseSetUpdateStatusEntityBulkActionBase } from "../../release-set-update-status-entity-bulk-action-base.js";
import {
  ReleaseSetTaskStatusModel,
  type ReleaseSetTaskResponseModel,
} from "@umbraco-workflow/generated";
import { makeArray } from "@umbraco-workflow/core";

export class WorkflowReleaseSetTaskUpdateStatusEntityBulkAction extends WorkflowReleaseSetUpdateStatusEntityBulkActionBase<ReleaseSetTaskResponseModel>  {
  constructor(
    host: UmbControllerHost,
    args: UmbEntityBulkActionArgs<ReleaseSetTaskResponseModel>
  ) {
    super(
      host,
      args,
      makeArray<ReleaseSetTaskStatusModel>("Active", "Closed", "Complete"),
      (context) => context.tasks,
      (data, tasks) => data.update({ tasks })
    );
  }
}
