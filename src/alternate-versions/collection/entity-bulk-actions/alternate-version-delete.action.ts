import {
  UmbEntityBulkActionArgs,
  UmbEntityBulkActionBase,
} from "@umbraco-cms/backoffice/entity-bulk-action";
import { umbConfirmModal, umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  UMB_COLLECTION_CONTEXT,
  UmbDefaultCollectionContext,
} from "@umbraco-cms/backoffice/collection";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { WorkflowAlternateVersionsCollectionRepository } from "../repository/index.js";
import type { AlternateVersionCollectionResponseModel } from "@umbraco-workflow/generated";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowAlternateVersionCollectionModel } from "../types.js";
import { html, unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_TEXT_MODAL } from "@umbraco-workflow/core";

export class WorkflowAlternateVersionCollectionDeleteBulkAction extends UmbEntityBulkActionBase<AlternateVersionCollectionResponseModel> {
  #collectionContext?: UmbDefaultCollectionContext<WorkflowAlternateVersionCollectionModel>;

  constructor(
    host: UmbControllerHost,
    args: UmbEntityBulkActionArgs<AlternateVersionCollectionResponseModel>
  ) {
    super(host, args);

    this.consumeContext(
      UMB_COLLECTION_CONTEXT,
      (
        context?: UmbDefaultCollectionContext<WorkflowAlternateVersionCollectionModel>
      ) => {
        if (!context) return;
        this.#collectionContext = context;
      }
    );
  }

  async execute(): Promise<void> {
    if (this.selection?.length === 0 || !this.#collectionContext) return;

    const localize = new UmbLocalizationController(this);

    const items = this.#collectionContext
      .getItems()
      .filter((x) => this.selection.includes(x.unique));

    if (items.every((x) => x.inSet?.length)) {
      umbOpenModal(this, WORKFLOW_TEXT_MODAL, {
        data: {
          content: localize.term("workflow_alternateVersions_noVersionsToDeleteDescription"),
        },
      }).catch(() => {});

      return;
    }

    const noDeleteItems = items.filter((x) => x.inSet?.length);

    const modalContent = noDeleteItems.length
      ? html`${unsafeHTML(
          localize.term(
            "workflow_alternateVersions_deleteVersionActiveItemsDescription",
            this.selection.length - noDeleteItems.length,
            noDeleteItems.map((x) => x.name)
          )
        )}`
      : localize.term(
          "workflow_alternateVersions_deleteVersionDescription",
          this.selection.length
        );

    await umbConfirmModal(this._host, {
      headline: localize.term("actions_delete"),
      content: modalContent,
      color: "danger",
      confirmLabel: localize.term("actions_delete"),
    }).catch(() => {});

    const repository = new WorkflowAlternateVersionsCollectionRepository(this);
    const noDeleteKeys = noDeleteItems.map((x) => x.unique);

    await repository.delete(
      this.selection.filter((x) => !noDeleteKeys.includes(x))
    );

    await this.#collectionContext.requestCollection();
  }
}

export { WorkflowAlternateVersionCollectionDeleteBulkAction as api };
