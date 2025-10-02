import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { RequestResult } from "@hey-api/client-fetch";
import { ValidActionDescriptor } from "../enums.js";
import { WorkflowNotificationManagerController } from "@umbraco-workflow/core";
import {
  ActionService,
  PostActionApproveResponses,
  type ActionWorkflowRequestModel,
  type ActionWorkflowResponseModelReadable,
} from "@umbraco-workflow/generated";

export interface InitiateWorkflowArgs {
  nodeUnique: string;
  entityType: string;
  publish: boolean;
  comment: string;
  variants: Array<string>;
  releaseDate?: string;
  expireDate?: string;
  attachmentId?: string;
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
          variant: args.variants,
          attachmentId: args.attachmentId ? +args.attachmentId : 0,
        },
      })
    );

    // only show variant names for variant content - invariant selector is meaningless
    const displayVariants = args.variants.includes("*") ? [] : args.variants;

    if (error) {
      this.#notificationManager.notify({
        color: "danger",
        key: 'workflow_unableToInitiate',
        args: [args.nodeUnique, displayVariants],
      });
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
      this.#notificationManager.notify({
        color: "danger",
        key: "workflow_unableToAction",
      });
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
