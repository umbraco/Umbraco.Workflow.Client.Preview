import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbCollectionDataSource } from "@umbraco-cms/backoffice/collection";
import type {
  WorkflowAlternateVersionCollectionModel,
  WorkflowAlternateVersionsCollectionFilterModel,
} from "../types.js";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import { VersionsService } from "@umbraco-workflow/generated";

export interface AlternateVersionCollectionOperationArgs {
  id: string;
  parentUnique?: string;
  variant: string | undefined;
  segment: string | undefined;
}

export class WorkflowAlternateVersionsCollectionServerDataSource
  implements UmbCollectionDataSource<WorkflowAlternateVersionCollectionModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async getCollection(filter: WorkflowAlternateVersionsCollectionFilterModel) {
    const { data, error } = await tryExecute(
      this.#host,
      VersionsService.getVersionAll({ query: filter })
    );

    if (data) {
      const items = data.items.map((item) => {
        const model: WorkflowAlternateVersionCollectionModel = {
          ...item,
          icon: item.icon ?? "icon-documents",
          entityType: ALTERNATEVERSION_ENTITY_TYPE,
        };

        return model;
      });

      return { data: { items, total: data.totalItems } };
    }

    return { error };
  }

  async delete(args: AlternateVersionCollectionOperationArgs) {
    return await tryExecute(
      this.#host,
      VersionsService.deleteVersionById({ query: args, path: { id: args.id } })
    );
  }
}
