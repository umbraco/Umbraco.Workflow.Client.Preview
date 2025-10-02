import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import {
  UMB_NOTIFICATION_CONTEXT,
  type UmbNotificationColor,
} from "@umbraco-cms/backoffice/notification";

type MessageArgs = Array<string | number | Array<string> | Array<number>>;

export class WorkflowNotificationManagerController extends UmbControllerBase {
  #localize = new UmbLocalizationController(this);

  async notify(args: {
    color: UmbNotificationColor;
    key: string;
    args?: MessageArgs;
    headline?: boolean;
  }) {
    // args may contain localization keys...
    args.args?.forEach((arg, idx) => {
      if (typeof arg === "string" && arg.includes("_")) {
        args.args![idx] = this.#localize.term(arg);
      } else if (Array.isArray(arg)) {
        arg.forEach((a) => {
          if (typeof a === "string" && a.includes("_")) {
            a = this.#localize.term(a);
          }
        });
      }
    });

    const notificationHandler = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    if (!notificationHandler) return;
    
    notificationHandler.peek(args.color, {
      data: {
        headline: args.headline !== false ? this.#localize.term("workflow_workflow") : undefined,
        message: this.#localize.term(args.key, ...(args.args ?? [])),
      },
    });
  }
}
