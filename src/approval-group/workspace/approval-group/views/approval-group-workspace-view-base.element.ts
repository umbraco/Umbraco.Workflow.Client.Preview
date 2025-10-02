
import {  state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT } from "../approval-group-workspace.context-token.js";
import type { ApprovalGroupDetailResponseModelReadable } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export abstract class WorkflowApprovalGroupWorkspaceViewBaseElement extends UmbLitElement {
  workspaceContext?: typeof WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT.TYPE;
  isTrial?: boolean;

  @state()
  _isNew?: boolean;

  @state()
  _group?: ApprovalGroupDetailResponseModelReadable;

  init: Promise<unknown>;

  constructor() {
    super();

    this.init = Promise.all([
      this.consumeContext(WORKFLOW_CONTEXT, (context) => {
        this.isTrial = context?.getLicense()?.isTrial ?? true;
      }).asPromise(),
      this.consumeContext(
        WORKFLOW_APPROVAL_GROUP_WORKSPACE_CONTEXT,
        (instance) => {
          this.workspaceContext = instance;

          this.observe(this.workspaceContext?.data, (group) => {
            this._group = group;
          });

          this.observe(this.workspaceContext?.isNew, (isNew) => {
            this._isNew = isNew;
          });
        }
      ).asPromise(),
    ]);
  }
}
