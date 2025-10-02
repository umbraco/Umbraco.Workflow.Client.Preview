import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type {
  WorkflowServerDataSource,
  WorkflowServerDataSourceConstructor,
} from "./workflow-server-data-source.js";
import type { WorkflowObjectStore } from "./workflow-object-store.js";

export abstract class WorkflowRepositoryBase<
  ModelType extends object,
  SaveModelType = ModelType
> extends UmbRepositoryBase {
  #init: Promise<unknown>;
  #dataSource: WorkflowServerDataSource<ModelType, SaveModelType>;
  #dataStore?: WorkflowObjectStore<ModelType>;

  constructor(
    host: UmbControllerHost,
    dataSource: WorkflowServerDataSourceConstructor<ModelType, SaveModelType>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataStoreContextAlias: string | UmbContextToken<any, any>
  ) {
    super(host);

    this.#dataSource = new dataSource(this);

    this.#init = Promise.all([
      this.consumeContext(dataStoreContextAlias, (instance) => {
        this.#dataStore = instance;
      }).asPromise(),
    ]);
  }

  async save(data?: SaveModelType) {
    if (!data) throw new Error("data is missing");
    await this.#init;

    const { data: updatedData, error } = await this.#dataSource.update(data);
    if (updatedData) {
      this.#dataStore?.update(updatedData);
    }

    return { data, error };
  }

  async read() {
    await this.#init;
    const { data, error } = await this.#dataSource.read();
    return { data, error };
  }
}
