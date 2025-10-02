import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import type { WorkflowReleaseSetCollectionModel } from '../../collection/entities.js';

export class WorkflowReleaseSetDetailStore extends UmbDetailStoreBase<WorkflowReleaseSetCollectionModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_RELEASESET_DETAIL_STORE_CONTEXT.toString());
  }
}

export default WorkflowReleaseSetDetailStore;

export const WORKFLOW_RELEASESET_DETAIL_STORE_CONTEXT =
  new UmbContextToken<WorkflowReleaseSetDetailStore>(
    "WorkflowReleaseSetDetailStore"
  );