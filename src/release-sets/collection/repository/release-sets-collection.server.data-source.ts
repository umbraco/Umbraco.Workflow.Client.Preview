import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  tryExecute,
} from "@umbraco-cms/backoffice/resources";
import type { UmbCollectionDataSource } from "@umbraco-cms/backoffice/collection";
import type {
  WorkflowReleaseSetCollectionFilterModel,
  WorkflowReleaseSetCollectionModel,
} from "../entities.js";
import { RELEASESET_ENTITY_TYPE } from "../../constants.js";
import { ReleaseSetsService } from "@umbraco-workflow/generated";

export class WorkflowReleaseSetsCollectionServerDataSource
  implements UmbCollectionDataSource<WorkflowReleaseSetCollectionModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  async delete(unique: string) {
    const { data, error } = await tryExecute(
      this.#host,
      ReleaseSetsService.deleteReleaseSetById({ path: { id: unique } })
    );

    return { data, error };
  }

  async getCollection(filter: WorkflowReleaseSetCollectionFilterModel) {
    const { data, error } = await tryExecute(
      this.#host,
      ReleaseSetsService.getReleaseSet({ query: filter })
    );

    if (data) {
      const items = data.items.map((item) => {
        const model: WorkflowReleaseSetCollectionModel = {
          ...item,
          icon: item.icon ?? "icon-document",
          entityType: RELEASESET_ENTITY_TYPE,
        };

        return model;
      });

      return { data: { items, total: data.totalItems } };
    }

    return { error };
  }
}
