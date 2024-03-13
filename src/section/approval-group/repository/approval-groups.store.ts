import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbDetailStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import type { WorkflowApprovalGroupDetailModel } from '../types.js';

export const WORKFLOW_APPROVALGROUPS_STORE_CONTEXT =
  new UmbContextToken<WorkflowApprovalGroupsStore>(
    "WorkflowApprovalGroupsStore",
  );

/**
 * @export
 * @class WorkflowApprovalGroupsStore
 * @extends {UmbStoreBase}
 * @description - Data Store for Approval Groups
 */
export class WorkflowApprovalGroupsStore extends UmbDetailStoreBase<WorkflowApprovalGroupDetailModel> {
  public readonly data = this._data.asObservable();

  constructor(host: UmbControllerHostElement) {
    super(
      host,
      WORKFLOW_APPROVALGROUPS_STORE_CONTEXT.toString(),
    );
  }
}
