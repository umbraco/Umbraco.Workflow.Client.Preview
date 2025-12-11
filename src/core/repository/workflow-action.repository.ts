import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { RequestResult } from "@hey-api/client-fetch";
import { ValidActionDescriptor } from "../enums.js";
import {
  ActionService,
  PostActionApproveResponses,
  type ActionWorkflowRequestModel,
} from "@umbraco-workflow/generated";
import { WorkflowNotificationManagerController } from "../notification-manager.controller.js";

export interface InitiateWorkflowArgs {
  nodeUnique: string;
  entityType: string;
  publish: boolean;
  comment: string;
  cultures: Array<string>;
  releaseDate?: string;
  expireDate?: string;
  attachmentId?: string;
  expander?: Record<string, any>;
}

export interface ActionWorkflowArgs {
  action: ValidActionDescriptor;
  entityType: string;
  instanceUnique: string;
  comment?: string;
  assignTo?: string;
}

export class WorkflowActionRepository extends UmbControllerBase {
  #notificationManager = new WorkflowNotificationManagerController(this);

  constructor(host: UmbControllerHostElement) {
    super(host);
  }

  async initiate(args: InitiateWorkflowArgs) {
    const { data, error } = await tryExecute(
      this._host,
      ActionService.postActionInitiate({
        body: {
          entityType: args.entityType,
          entityId: args.nodeUnique,
          comment: args.comment,
          releaseDate: args.releaseDate,
          expireDate: args.expireDate,
          publish: args.publish,
          culture: args.cultures,
          attachmentId: args.attachmentId ? +args.attachmentId : 0,
          expander: args.expander,
        },
      })
    );

    // only show variant names for variant content - invariant selector is meaningless
    const displayCultures = args.cultures.includes("*") ? [] : args.cultures;

    if (error) {
      this.#notificationManager.danger("workflow_unableToInitiate", [
        args.nodeUnique,
        displayCultures,
      ]);
      return;
    }

    return data;
  }

  async action(args: ActionWorkflowArgs) {
    const actionMethod = this.#workflowActionSelector(args.action);

    if (!actionMethod) {
      return;
    }

    const { data, error } = await tryExecute(
      this._host,
      actionMethod({
        body: {
          comment: args.comment ?? "",
          instanceGuid: args.instanceUnique,
          assignTo: args.assignTo,
          entityType: args.entityType,
        },
      })
    );

    if (error) {
      this.#notificationManager.danger("workflow_unableToAction");
      return;
    }

    return data;
  }

  #workflowActionSelector<ThrowOnError extends boolean = true>(
    action: ValidActionDescriptor
  ):
    | (({
        body,
      }: {
        body: ActionWorkflowRequestModel;
      }) => RequestResult<PostActionApproveResponses, unknown, ThrowOnError>)
    | undefined {
    switch (action) {
      case ValidActionDescriptor.APPROVE:
        return ActionService.postActionApprove;
      case ValidActionDescriptor.CANCEL:
        return ActionService.postActionCancel;
      case ValidActionDescriptor.REJECT:
        return ActionService.postActionReject;
      case ValidActionDescriptor.RESUBMIT:
        return ActionService.postActionResubmit;
    }
  }
}
