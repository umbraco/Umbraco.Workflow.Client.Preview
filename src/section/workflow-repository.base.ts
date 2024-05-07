import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import {
  UMB_NOTIFICATION_CONTEXT,
  type UmbNotificationContext,
} from "@umbraco-cms/backoffice/notification";

import type {
  WorkflowServerDataSource,
  WorkflowServerDataSourceConstructor,
} from "./workflow-server-data-source.js";
import type { WorkflowObjectStore } from "./workflow-object-store.js";

export class WorkflowRepositoryBase<
  ModelType extends object,
  SaveModelType = ModelType
> extends UmbControllerBase {
  #init: Promise<unknown>;
  #dataSource: WorkflowServerDataSource<ModelType, SaveModelType>;

  #dataStore?: WorkflowObjectStore<ModelType>;
  notificationContext?: UmbNotificationContext;

  constructor(
    host: UmbControllerHost,
    dataSource: WorkflowServerDataSourceConstructor<ModelType, SaveModelType>,
    dataStoreContextAlias: string | UmbContextToken<any, any>
  ) {
    super(host);

    this.#dataSource = new dataSource(this);

    this.#init = Promise.all([
      this.consumeContext(dataStoreContextAlias, (instance) => {
        this.#dataStore = instance;
      }).asPromise(),
      this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
        this.notificationContext = instance;
      }).asPromise(),
    ]);
  }

  async save(data: SaveModelType) {
    if (!data) throw new Error("data is missing");
    await this.#init;

    const { data: updatedData, error } = await this.#dataSource.update(data);
    if (updatedData) {
      this.#dataStore?.update(updatedData);

      const notification = { data: { message: "saved" } };
      this.notificationContext?.peek("positive", notification);
    }

    return { data, error };
  }

  async read() {
    await this.#init;
    const { data, error } = await this.#dataSource.read();
    return { data, error };
  }
}
