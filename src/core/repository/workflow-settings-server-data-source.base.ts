import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";

export abstract class WorkflowSettingsServerDataSourceBase<
  DataModelType,
  SaveModelType = DataModelType
> {
  #host: UmbControllerHost;

  #update: (args: { body: SaveModelType }) => Promise<{ data: DataModelType }>;
  #read: () => Promise<{ data: DataModelType }>;

  constructor(args: {
    host: UmbControllerHost;
    read: () => Promise<{ data: DataModelType }>;
    update: (args: { body: SaveModelType }) => Promise<{ data: DataModelType }>;
  }) {
    this.#host = args.host;
    this.#read = args.read;
    this.#update = args.update;
  }

  async read() {
    return await tryExecute(this.#host, this.#read());
  }

  async update(model: SaveModelType) {
    return await tryExecute(this.#host, this.#update({ body: model }));
  }
}
