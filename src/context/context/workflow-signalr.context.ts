import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import * as signalR from "@microsoft/signalr";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";

export class WorkflowSignalRContext extends UmbControllerBase {
  #connection: signalR.HubConnection | null = null;

  #complete = new UmbObjectState<string | null>(null);

  public readonly complete = this.#complete.asObservable();

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

    this.#connection.on("workflowRefresh", (data) => {
      console.log(data);
    });

    this.#connection.on("workflowAction", (data) => {
      console.log(data);
    });

    await this.#connection.start();
  }
}

export default WorkflowSignalRContext;
