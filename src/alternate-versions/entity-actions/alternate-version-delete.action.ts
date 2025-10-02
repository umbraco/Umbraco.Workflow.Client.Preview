import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import {
  UmbEntityActionBase,
  type UmbEntityActionArgs,
} from "@umbraco-cms/backoffice/entity-action";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../workspace/context/alternate-version-workspace.context-token.js";
import { WorkflowAlternateVersionDetailRepository } from "../repository/detail/index.js";

export class WorkflowAlternateVersionCollectionDeleteEntityAction extends UmbEntityActionBase<never> {
  constructor(host: UmbControllerHost, args: UmbEntityActionArgs<never>) {
    super(host, args);
  }

  async execute(): Promise<void> {
    if (!this.args.unique) throw new Error("Unique is required");

    const workspaceContext = await this.getContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT
    );
    if (!workspaceContext) {
      throw new Error(
        "Could not find context: WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT"
      );
    }

    const version = workspaceContext.getData();
    if (!version) throw new Error("Version is required");

    const localize = new UmbLocalizationController(this);

    await umbConfirmModal(this._host, {
      headline: localize.term("actions_delete"),
      content: localize.term(
        "workflow_alternateVersions_deleteSingleVersionDescription",
        version?.versionName
      ),
      color: "danger",
      confirmLabel: localize.term("actions_delete"),
    }).catch(() => {});

    const repository = new WorkflowAlternateVersionDetailRepository(this);
    await repository.deleteVersion(version);
  }
}

export { WorkflowAlternateVersionCollectionDeleteEntityAction as api };
