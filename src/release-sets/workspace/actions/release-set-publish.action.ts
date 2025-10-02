import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  UmbWorkspaceActionBase,
  type UmbWorkspaceActionArgs,
} from "@umbraco-cms/backoffice/workspace";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { html, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../release-set-workspace.context-token.js";
import {
  ReleaseSetItemStatusModel,
  ReleaseSetStatusModel,
  ReleaseSetTaskStatusModel,
  type ReleaseSetItemResponseModelReadable,
  type ReleaseSetTaskResponseModelReadable,
} from "@umbraco-workflow/generated";
import { asDatetimeLocal } from "@umbraco-workflow/core";

export class WorkflowReleaseSetPublishAction extends UmbWorkspaceActionBase<never> {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;
  #localize = new UmbLocalizationController(this);

  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
    });
  }

  override async execute() {
    if (!this.#workspaceContext) return;

    const draftItems = await this.#getDraftItems();
    const incompleteTasks = await this.#getIncompleteTasks();

    if (draftItems.length || incompleteTasks.length) {
      umbConfirmModal(this, {
        headline: this.#localize.term("workflow_releaseSets_unableToPublish"),
        content: this.#getModalContent(draftItems, incompleteTasks),
      })
        .then(() => this.#submit(true))
        .catch(() => {});
    } else {
      this.#submit(false);
    }
  }

  #submit(completeAllItems?: boolean) {
    if (!this.#workspaceContext) return;

    this.#workspaceContext.update({ releaseDate: asDatetimeLocal() });
    this.#workspaceContext.updateSetStatus(
      ReleaseSetStatusModel.PUBLISHED,
      completeAllItems
    );
    this.#workspaceContext.submit();
  }

  #getModalContent(
    draftItems: Array<ReleaseSetItemResponseModelReadable>,
    incompleteTasks: Array<ReleaseSetTaskResponseModelReadable>
  ) {
    return html`${when(
      draftItems.length,
      () =>
        html`<strong
            >${this.#localize.term("workflow_releaseSets_draftItems")}</strong
          >
          <ul style="margin: 1rem 0">
            ${draftItems.map(
              (draft) =>
                html`<li>
                  ${draft.name}: ${draft.items.length}
                  ${this.#localize.term("workflow_alternateVersions_versions")}
                </li>`
            )}
          </ul>`
    )}
    ${when(
      incompleteTasks.length,
      () =>
        html`<strong
            >${this.#localize.term(
              "workflow_releaseSets_incompleteTasks"
            )}</strong
          >
          <ul style="margin: 1rem 0">
            ${incompleteTasks.map((task) => html`<li>${task.name}</li>`)}
          </ul>`
    )}`;
  }

  async #getDraftItems() {
    if (!this.#workspaceContext) return [];

    const items = await firstValueFrom(this.#workspaceContext.items);
    if (!items) return [];

    return items
      .filter((x) =>
        x.items.some((y) => y.status === ReleaseSetItemStatusModel.DRAFT)
      )
      .map((x) => ({
        ...x,
        ...{
          items: x.items.filter(
            (x) => x.status === ReleaseSetItemStatusModel.DRAFT
          ),
        },
      }));
  }

  async #getIncompleteTasks() {
    if (!this.#workspaceContext) return [];

    const tasks = await firstValueFrom(this.#workspaceContext.tasks);
    if (!tasks) return [];

    return tasks.filter((x) => x.status === ReleaseSetTaskStatusModel.ACTIVE);
  }
}

export { WorkflowReleaseSetPublishAction as api };
