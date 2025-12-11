import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import {
  HubConnectionBuilder,
  type HubConnection,
} from "@umbraco-cms/backoffice/external/signalr";
import { Subject } from "@umbraco-cms/backoffice/external/rxjs";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { WORKFLOW_CONTEXT, WORKFLOW_SIGNALR_CONTEXT } from "../token/index.js";

export class WorkflowSignalRContext extends UmbContextBase {
  #connection: HubConnection | null = null;
  #userUnique?: string;
  #hubUrl!: string;

  readonly WORKFLOW_REFRESH = "workflowrefresh";
  readonly WORKFLOW_ACTION = "workflowaction";

  /**
   * Emits when the hub response includes the current user unique id.
   */
  public readonly refresh = new Subject<boolean>();

  public readonly action = new Subject<[string, string | number]>();

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_SIGNALR_CONTEXT);

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      if (!context) return;
      this.observe(context.unique, (unique) => (this.#userUnique = unique));
    });

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;
      this.observe(context.hubUrl, (hubUrl) => {
        if (!hubUrl) return;
        this.#hubUrl = hubUrl;
        this.#setupConnection();
      });
    });
  }

  hostDisconnected() {
    super.hostDisconnected();
    this.#connection?.stop().then(() => {});
  }

  async #setupConnection() {
    this.#connection = new HubConnectionBuilder()
      .withUrl(this.#hubUrl)
      .withAutomaticReconnect()
      .build();

    this.#connection.on(this.WORKFLOW_REFRESH, (data: Array<string>) => {
      if (!this.#userUnique) return;
      if (data.includes(this.#userUnique)) {
        this.refresh.next(true);
      }
    });

    this.#connection.on(
      this.WORKFLOW_ACTION,
      (data: [string, string | number]) => {
        this.action.next(data);
      }
    );

    await this.#connection.start();
  }
}

export default WorkflowSignalRContext;
