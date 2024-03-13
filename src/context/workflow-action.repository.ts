import type {
  UmbNotificationContext} from "@umbraco-cms/backoffice/notification";
import {
  UMB_NOTIFICATION_CONTEXT
} from "@umbraco-cms/backoffice/notification";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type {
  UmbControllerHostElement} from "@umbraco-cms/backoffice/controller-api";
import {
  UmbControllerBase
} from "@umbraco-cms/backoffice/class-api";
import { UmbContextConsumerController } from "@umbraco-cms/backoffice/context-api";
import {
  ActionResource,
  WorkflowTypeModel,
} from "@umbraco-workflow/generated";
import type {
  ActionWorkflowRequestModel,
  ActionWorkflowResponseModel,
  CancelablePromise} from "@umbraco-workflow/generated";

export enum ValidActionDescriptor {
  APPROVE,
  CANCEL,
  REJECT,
  RESUBMIT,
}

export class WorkflowActionRepository extends UmbControllerBase {
  #notificationContext?: UmbNotificationContext;
  #host: UmbControllerHostElement;
  #init: Promise<unknown>;

  constructor(host: UmbControllerHostElement) {
    super(host);

    this.#host = host;

    this.#init = Promise.all([
      new UmbContextConsumerController(
        this.#host,
        UMB_NOTIFICATION_CONTEXT,
        (instance) => {
          this.#notificationContext = instance;
        }
      ).asPromise(),
    ]);
  }

  async initiate(
    publish: boolean,
    nodeUnique: string,
    comment: string,
    variants: Array<string>,
    releaseDate?: string,
    expireDate?: string,
    attachmentId?: string
  ) {
    await this.#init;

    // TODO => final two props should not exist on client
    // attachmentId should be a guid
    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ActionResource.postActionInitiate({
        requestBody: {
          entityId: nodeUnique,          
          comment,
          releaseDate,
          expireDate,
          publish,
          variant: variants,
          attachmentId: attachmentId ? +attachmentId : 0,
          variantToInitiate: '',
          type: WorkflowTypeModel.BOTH
        },
      })
    );

    if (error) {
      const notification = {
        data: { message: `Unable to initiate workflow on node '${nodeUnique}'` },
      };
      this.#notificationContext?.peek("danger", notification);
      return;
    }

    const notification = { data: { message: `Message about new workflow being created` } };
    this.#notificationContext?.peek("positive", notification);

    return data;
  }

  async action(
    action: ValidActionDescriptor,
    instanceGuid: string,
    offline: boolean,
    comment?: string,
    assignTo?: string
  ) {
    await this.#init;
    
    const actionMethod = this.#workflowActionSelector(action);

    if (!actionMethod) {
      return;
    }

    const requestBody = {
      comment: comment ?? '',
      instanceGuid,
      offline,
      assignTo,
      taskId: 0,
      groupId: 0,
      isAdmin: false,
    };

    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      actionMethod({ requestBody })
    );

    if (error) {
      const notification = { data: { message: `Unable to action workflow.` } };
      this.#notificationContext?.peek("danger", notification);
      return;
    }

    const notification = { data: { message: `Message about workflow being actioned` } };
    this.#notificationContext?.peek("positive", notification);

    return data;
  }

  #workflowActionSelector(
    action: ValidActionDescriptor
  ):
    | (({
        requestBody,
      }: {
        requestBody?: ActionWorkflowRequestModel | undefined;
      }) => CancelablePromise<ActionWorkflowResponseModel>)
    | undefined {
    switch (action) {
      case ValidActionDescriptor.APPROVE:
        return ActionResource.postActionApprove;
      case ValidActionDescriptor.CANCEL:
        return ActionResource.postActionCancel;
      case ValidActionDescriptor.REJECT:
        return ActionResource.postActionReject;
      case ValidActionDescriptor.RESUBMIT:
        return ActionResource.postActionResubmit;
    }
  }
}
