import { UmbItemRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { AlternateVersionItemServerDataSource } from "./alternate-version-item.server.data-source.js";
import { WORKFLOW_ALTERNATEVERSION_ITEM_STORE_CONTEXT } from "./alternate-version-item.store.js";
import {
  VersionsService,
  type AlternateVersionCollectionResponseModel,
} from "@umbraco-workflow/generated";
import { tryExecute } from "@umbraco-cms/backoffice/resources";

export class AlternateVersionItemRepository extends UmbItemRepositoryBase<AlternateVersionCollectionResponseModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      AlternateVersionItemServerDataSource,
      WORKFLOW_ALTERNATEVERSION_ITEM_STORE_CONTEXT
    );
  }

  async requestItemsOfCulture(args: {
    unique: string;
    culture?: string;
    segment?: string;
    skip?: number;
    take?: number;
  }) {
    const { data, error } = await tryExecute(
      this,
      VersionsService.getVersionAll({
        query: { ...args },
      })
    );

    return { data: data.items, total: data.totalItems, error };
  }
}

export default AlternateVersionItemRepository;
