import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import * as signalR from "@microsoft/signalr";
import { Subject } from "@umbraco-cms/backoffice/external/rxjs";

export class WorkflowSignalRContext extends UmbControllerBase {
  #connection: signalR.HubConnection | null = null;

  public readonly refresh = new Subject<Array<string>>();
  public readonly action = new Subject<any>();

  hostConnected(): void {
    super.hostConnected();
    this.#setupConnection();
  }

  hostDisconnected() {
    super.hostDisconnected();
    this.#connection?.stop().then(() => {
      console.debug("connection closed");
    });
  }

  // TODO => provide url
  async #setupConnection() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/umbraco/WorkflowHub")
      .withAutomaticReconnect();

    this.#connection = connection.build();

    this.#connection.on("workflowRefresh", (data: Array<string>) => {
      this.refresh.next(data);
    });

    this.#connection.on("workflowAction", (data: any) => {
      this.action.next(data);
    });

    await this.#connection.start();
  }
}

export default WorkflowSignalRContext;
