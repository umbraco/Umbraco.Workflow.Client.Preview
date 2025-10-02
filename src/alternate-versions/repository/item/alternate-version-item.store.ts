import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbItemStoreBase } from "@umbraco-cms/backoffice/store";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import type { AlternateVersionCollectionResponseModel } from "@umbraco-workflow/generated";

export class AlternateVersionItemStore extends UmbItemStoreBase<AlternateVersionCollectionResponseModel> {
  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_ALTERNATEVERSION_ITEM_STORE_CONTEXT.toString());
  }
}

export default AlternateVersionItemStore;

export const WORKFLOW_ALTERNATEVERSION_ITEM_STORE_CONTEXT =
  new UmbContextToken<AlternateVersionItemStore>(
    "AlternateVersionItemStore"
  );
