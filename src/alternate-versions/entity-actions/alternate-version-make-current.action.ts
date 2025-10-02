import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import {
  UmbEntityActionBase,
  type UmbEntityActionArgs,
} from "@umbraco-cms/backoffice/entity-action";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowAlternateVersionDetailRepository } from "../repository/detail/index.js";

export class WorkflowAlternateVersionCollectionMakeCurrentEntityAction extends UmbEntityActionBase<never> {
  #detailRepository = new WorkflowAlternateVersionDetailRepository(
    this
  );

  constructor(host: UmbControllerHost, args: UmbEntityActionArgs<never>) {
    super(host, args);
  }

  override async execute() {
    if (!this.args.unique) throw new Error("Unique is required");

    const localize = new UmbLocalizationController(this);

    await umbConfirmModal(this._host, {
      headline: localize.term("buttons_confirmActionConfirm"),
      content: localize.term(
        "workflow_alternateVersions_makeCurrentDescription"
      ),
    }).catch(() => {});

    await this.#detailRepository.setActive(this.args.unique);
  }
}

export { WorkflowAlternateVersionCollectionMakeCurrentEntityAction as api };
