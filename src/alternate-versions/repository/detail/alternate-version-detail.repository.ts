import { UmbDetailRepositoryBase } from "@umbraco-cms/backoffice/repository";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import { WorkflowAlternateVersionDetailServerDataSource } from "./alternate-version-detail.server.data-source.js";
import { WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_CONTEXT } from "./alternate-version-detail.store.js";
import {
  VersionsService,
  type AlternateVersionDetailResponseModelReadable,
} from "@umbraco-workflow/generated";

export class WorkflowAlternateVersionDetailRepository extends UmbDetailRepositoryBase<AlternateVersionDetailResponseModelReadable> {
  constructor(host: UmbControllerHost) {
    super(
      host,
      WorkflowAlternateVersionDetailServerDataSource,
      WORKFLOW_ALTERNATEVERSION_DETAIL_STORE_CONTEXT
    );
  }

  async #notify(error: Error) {
    const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notificationContext?.peek("danger", {
      data: { message: error.message },
    });
  }

  async deleteVersion(version: AlternateVersionDetailResponseModelReadable) {
    const { error } = await tryExecute(
      this,
      VersionsService.deleteVersionById({
        path: { id: version.unique },
        query: {
          variant: version.variant ?? undefined,
          segment: version.segment ?? undefined,
        },
      })
    );

    error ? this.#notify(error) : {};
  }

  async setActive(unique: string) {
    const { error } = await tryExecute(
      this,
      VersionsService.postVersionActive({
        query: { unique },
      })
    );

    if (error) {
      this.#notify(error);
      return;
    }

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) {
      throw new Error("Context not found: UMB_MODAL_MANAGER_CONTEXT");
    }

    const modal = (await firstValueFrom(modalContext.modals)).find(
      (x) => x.data.entityType === ALTERNATEVERSION_ENTITY_TYPE
    );

    modal?.submit();
  }
}

export default WorkflowAlternateVersionDetailRepository;
