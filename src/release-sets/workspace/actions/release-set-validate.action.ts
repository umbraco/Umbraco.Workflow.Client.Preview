import {
  UmbWorkspaceActionArgs,
  UmbWorkspaceActionBase,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../release-set-workspace.context-token.js";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { html, when } from "@umbraco-cms/backoffice/external/lit";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import {
  ReleaseSetItemResponseModel,
  ReleaseSetTaskResponseModel,
} from "@umbraco-workflow/generated";

export abstract class WorkflowReleaseSetValidateAction extends UmbWorkspaceActionBase<never> {
  protected workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;
  #localize = new UmbLocalizationController(this);

  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.workspaceContext = context;
    });
  }

  async validate(callback: () => void) {
    const draftItems = await this.#getDraftItems();
    const incompleteTasks = await this.#getIncompleteTasks();
    if (draftItems.length || incompleteTasks.length) {
      umbConfirmModal(this, {
        headline: this.#localize.term("workflow_releaseSets_unableToPublish"),
        content: this.#getModalContent(draftItems, incompleteTasks),
        confirmLabel: "#general_ok",
      }).catch(() => {});
    } else {
      callback();
    }
  }

  #getModalContent(
    draftItems: Array<ReleaseSetItemResponseModel>,
    incompleteTasks: Array<ReleaseSetTaskResponseModel>
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
    if (!this.workspaceContext) return [];

    const items = await firstValueFrom(this.workspaceContext.items);
    if (!items) return [];

    return items
      .filter((x) => x.items.some((y) => y.status === "Draft"))
      .map((x) => ({
        ...x,
        ...{
          items: x.items.filter((x) => x.status === "Draft"),
        },
      }));
  }

  async #getIncompleteTasks() {
    if (!this.workspaceContext) return [];

    const tasks = await firstValueFrom(this.workspaceContext.tasks);
    if (!tasks) return [];

    return tasks.filter((x) => x.status === "Active");
  }
}
