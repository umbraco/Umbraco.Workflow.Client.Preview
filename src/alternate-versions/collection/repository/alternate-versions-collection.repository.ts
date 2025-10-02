import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbCollectionRepository } from "@umbraco-cms/backoffice/collection";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import {
  type WorkflowAlternateVersionDetailStore,
  WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_CONTEXT,
} from "../../repository/detail/alternate-version-detail.store.js";
import type { WorkflowAlternateVersionsCollectionFilterModel } from "../types.js";
import { WorkflowAlternateVersionsCollectionServerDataSource } from "./alternate-versions-collection.server.data-source.js";

export class WorkflowAlternateVersionsCollectionRepository
  extends UmbControllerBase
  implements UmbCollectionRepository
{
  #localize = new UmbLocalizationController(this);
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #collectionSource = new WorkflowAlternateVersionsCollectionServerDataSource(this);

  #init: Promise<unknown>;
  #unique?: string | null;
  #activeVariant?: UmbVariantId;

  #detailStore?: WorkflowAlternateVersionDetailStore;

  constructor(host: UmbControllerHost) {
    super(host);      

    this.#init = Promise.all([
      this.consumeContext(
        WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_CONTEXT,
        (instance) => (this.#detailStore = instance)
      ).asPromise(),
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (instance) => {
        this.#workspaceContext = instance;
        this.#setActiveVariant();
      }).asPromise(),
      this.consumeContext(UMB_NOTIFICATION_CONTEXT, (context) => {
        this.#notificationContext = context;
      }).asPromise(),
    ]);
  }

  #setActiveVariant() {
    if (!this.#workspaceContext) return;

    this.#unique = this.#workspaceContext.getUnique();

    this.observe(
      this.#workspaceContext.splitView.activeVariantsInfo,
      (variants) => {
        const activeVariant = variants.at(0);
        this.#activeVariant =
          activeVariant?.culture !== "invariant"
            ? new UmbVariantId(activeVariant?.culture, activeVariant?.segment)
            : UmbVariantId.CreateInvariant();
      }
    );
  }

  async requestCollection(
    filter: WorkflowAlternateVersionsCollectionFilterModel
  ) {
    await this.#init;
    if (!this.#unique) throw new Error("Unique is missing");

    const { data, error } = await this.#collectionSource.getCollection({
      ...filter,
      ...{
        unique: this.#unique,
        variant: this.#activeVariant?.culture ?? undefined,
        segment: this.#activeVariant?.segment ?? undefined,
      },
    });

    if (data && this.#detailStore) {
      this.#detailStore.appendItems(data.items);
    }

    return { data, error, asObservable: () => this.#detailStore!.all() };
  }

  async delete(uniques: Array<string>) {
    await this.#init;

    let count = 0;

    for (const unique of uniques) {
      const { error } = await this.#collectionSource.delete({
        id: unique,
        variant: this.#activeVariant?.culture ?? undefined,
        segment: this.#activeVariant?.segment ?? undefined,
      });

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

export default WorkflowAlternateVersionsCollectionRepository;
