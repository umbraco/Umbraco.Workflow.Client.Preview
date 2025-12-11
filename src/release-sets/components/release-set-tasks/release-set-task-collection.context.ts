import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { WORKFLOW_RELEASESET_TASK_TABLE_COLLECTION_VIEW_ALIAS } from "./constants.js";
import { type ReleaseSetTaskResponseModel } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetTaskCollectionContext extends UmbDefaultCollectionContext<ReleaseSetTaskResponseModel> {
  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_RELEASESET_TASK_TABLE_COLLECTION_VIEW_ALIAS);
  }
}

export { WorkflowReleaseSetTaskCollectionContext as api };

export const WORKFLOW_RELEASESET_TASK_COLLECTION_CONTEXT =
  new UmbContextToken<WorkflowReleaseSetTaskCollectionContext>(
    "UmbCollectionContext"
  );
