import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import type { WorkflowAlternateVersionCollectionModel } from '../../collection/types.js';

export class WorkflowAlternateVersionDetailStore extends UmbDetailStoreBase<WorkflowAlternateVersionCollectionModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_CONTEXT.toString());
  }
}

export default WorkflowAlternateVersionDetailStore;

export const WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_CONTEXT =
  new UmbContextToken<WorkflowAlternateVersionDetailStore>(
    "WorkflowAlternateVersionDetailStore"
  );