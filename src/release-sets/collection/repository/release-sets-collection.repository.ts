import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import {
  type WorkflowReleaseSetDetailStore,
  WORKFLOW_RELEASESET_DETAIL_STORE_CONTEXT,
} from "../../repository/detail/release-set-detail.store.js";
import type { WorkflowReleaseSetCollectionFilterModel } from "../entities.js";
import { WorkflowReleaseSetsCollectionServerDataSource } from "./release-sets-collection.server.data-source.js";

export class WorkflowReleaseSetsCollectionRepository
  extends UmbControllerBase
  implements UmbCollectionRepository
{
  #localize = new UmbLocalizationController(this);
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  #init: Promise<unknown>;

  #detailStore?: WorkflowReleaseSetDetailStore;
  #collectionSource: WorkflowReleaseSetsCollectionServerDataSource;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#collectionSource = new WorkflowReleaseSetsCollectionServerDataSource(
      this._host
    );

    this.#init = Promise.all([
      this.consumeContext(
        WORKFLOW_RELEASESET_DETAIL_STORE_CONTEXT,
        (instance) => {
          if (!instance) return;
          this.#detailStore = instance;
        }
      ).asPromise(),
      this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
        if (!context) return;
        this.#notificationContext = context;
      }).asPromise(),
    ]);
  }

  async requestCollection(
    filter: WorkflowReleaseSetCollectionFilterModel = { skip: 0, take: 10 }
  ) {
    await this.#init;

    const { data, error } = await this.#collectionSource.getCollection(filter);

    if (data && this.#detailStore) {
      this.#detailStore.appendItems(data.items);
    }

    return { data, error, asObservable: () => this.#detailStore!.all() };
  }

  async delete(uniques: Array<string>) {
    let count = 0;

    for (const unique of uniques) {
      const { error } = await this.#collectionSource.delete(unique);

      if (error) {
        this.#notificationContext?.peek("danger", {
          data: { message: error.message },
        });
      } else {
        count++;
      }
    }
  }
}

export default WorkflowReleaseSetsCollectionRepository;
