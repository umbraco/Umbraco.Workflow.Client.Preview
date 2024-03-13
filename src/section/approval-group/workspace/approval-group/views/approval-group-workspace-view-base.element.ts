import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement, state } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT } from "../approval-group-workspace.context-token.js";
import type { WorkflowApprovalGroupDetailModel } from "../../../types.js";

export class WorkflowApprovalGroupWorkspaceViewBase extends UmbElementMixin(
  LitElement
) {
  workspaceContext?: typeof WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT.TYPE;

  @state()
  _isNew?: boolean;

  @state()
  _group?: WorkflowApprovalGroupDetailModel;

  init: Promise<unknown>;

  constructor() {
    super();

    this.init = Promise.all([
      this.consumeContext(
        WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT,
        (instance) => {
          this.workspaceContext = instance;

          this.observe(this.workspaceContext.data, (group) => {
            this._group = group;
          });

          this.observe(this.workspaceContext.isNew, (isNew) => {
            this._isNew = isNew;
          });
        }
      ).asPromise(),
    ]);
  }
}
