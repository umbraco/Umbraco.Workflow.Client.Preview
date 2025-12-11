import { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_RELEASESET_ITEM_TABLE_COLLECTION_VIEW_ALIAS } from "./constants.js";
import { type ReleaseSetItemResponseModel } from "@umbraco-workflow/generated";
import { ALTERNATEVERSION_ENTITY_TYPE } from "@umbraco-workflow/alternate-versions";
import { UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/router";
import { UMB_WORKSPACE_MODAL } from "@umbraco-cms/backoffice/workspace";
import { UmbStringState } from "@umbraco-cms/backoffice/observable-api";

export class WorkflowReleaseSetItemCollectionContext extends UmbDefaultCollectionContext<ReleaseSetItemResponseModel> {
  #alternateVersionModalPath = new UmbStringState("");
  alternateVersionModalPath = this.#alternateVersionModalPath.asObservable();

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_RELEASESET_ITEM_TABLE_COLLECTION_VIEW_ALIAS);
    this.#registerAlternateVersionModal();
  }

  #registerAlternateVersionModal() {
    new UmbModalRouteRegistrationController(
      this,
      UMB_WORKSPACE_MODAL,
      "addVersionModal"
    )
      .addAdditionalPath(ALTERNATEVERSION_ENTITY_TYPE)
      .onSetup(() => ({
        data: { entityType: ALTERNATEVERSION_ENTITY_TYPE },
        preset: {},
      }))
      .observeRouteBuilder((routeBuilder) => {
        const path = routeBuilder({});
        this.#alternateVersionModalPath?.setValue(path);
      });
  }
}

export { WorkflowReleaseSetItemCollectionContext as api };
