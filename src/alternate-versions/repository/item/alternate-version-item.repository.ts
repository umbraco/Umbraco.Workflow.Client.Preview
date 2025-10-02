import { UmbItemRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { AlternateVersionItemServerDataSource } from "./alternate-version-item.server.data-source.js";
import { WORKFLOW_ALTERNATEVERSION_ITEM_STORE_CONTEXT } from "./alternate-version-item.store.js";
import type { AlternateVersionCollectionResponseModel } from "@umbraco-workflow/generated";

export class AlternateVersionItemRepository extends UmbItemRepositoryBase<AlternateVersionCollectionResponseModel> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      AlternateVersionItemServerDataSource,
      WORKFLOW_ALTERNATEVERSION_ITEM_STORE_CONTEXT
    );
  }
}

export default AlternateVersionItemRepository;
