import {
  UMB_NOTIFICATION_CONTEXT,
  type UmbNotificationColor,
} from "@umbraco-cms/backoffice/notification";

import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { ValidActionDescriptor } from "../enums.js";
import {
  ActionService,
  type ActionWorkflowRequestModel,
  type ActionWorkflowResponseModel,
  type CancelablePromise,
} from "@umbraco-workflow/generated";

export interface InitiateWorkflowArgs {
  nodeUnique: string;
  publish: boolean;
  comment: string;
  variants: Array<string>;
  releaseDate?: string;
  expireDate?: string;
  attachmentId?: string;
}

export class WorkflowActionRepository extends UmbControllerBase {
  #host: UmbControllerHostElement;

  constructor(host: UmbControllerHostElement) {
    super(host);
    this.#host = host;
  }

  async initiate(args: InitiateWorkflowArgs) {
    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      ActionService.postActionInitiate({
        requestBody: {
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

    // TODO => localize these
    if (error) {
      this.#notify(
        "danger",
        `Unable to initiate workflow on document '${
          args.nodeUnique
        }' (${args.variants.join(",")})`
      );
      return;
    }

    this.#notify(
      "positive",
      `Workflow ${
        args.publish ? "publish" : "unpublish"
      } approval requested (${args.variants.join(",")})`
    );
    return data;
  }

  async action(
    action: ValidActionDescriptor,
    instanceGuid: string,
    offline: boolean,
    comment?: string,
    assignTo?: string
  ) {
    const actionMethod = this.#workflowActionSelector(action);

    if (!actionMethod) {
      return;
    }
    const { data, error } = await tryExecuteAndNotify(
      this.#host,
      actionMethod({
        requestBody: {
          comment: comment ?? "",
          instanceGuid,
          offline,
          assignTo,
          taskId: 0,
          groupId: 0,
          isAdmin: false,
        },
      })
    );

    if (error) {
      this.#notify("danger", `Unable to action workflow.`);
      return;
    }

    this.#notify("positive", `Workflow action completed: ${ValidActionDescriptor[action].toString()}`);
    return data;
  }

  async #notify(color: UmbNotificationColor, message: string) {
    const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notificationContext.peek(color, { data: { message } });
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
