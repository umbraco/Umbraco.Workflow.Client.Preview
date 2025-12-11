import { umbConfirmModal, umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  UmbWorkspaceActionArgs,
  UmbWorkspaceActionBase,
} from "@umbraco-cms/backoffice/workspace";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL } from "../modal/index.js";
import { ContentReviewService } from "@umbraco-workflow/generated";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";

export class WorkflowMarkReviewedWorkspaceAction extends UmbWorkspaceActionBase {
  #localize = new UmbLocalizationController(this);
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  #currentUserShouldReview = false;
  #init: Promise<unknown>;

  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);

    this.#init = Promise.all([
      this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
        this.#workflowManagerContext = context;

        this.observe(context?.scaffold, (scaffold) => {
          this.#currentUserShouldReview =
            scaffold?.review?.currentUserShouldReview ?? false;
        });
      }).asPromise(),

      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
        this.#workspaceContext = context;
      }).asPromise(),
    ]);
  }

  async hostConnected() {
    super.hostConnected();
    await this.#init;

    // without a timeout the dialog does not show?
    // likely because a context somewhere is destroyed?
    if (this.#currentUserShouldReview) {
      setTimeout(() => this.#showExpiredDialog(), 100);
    }
  }

  async #showExpiredDialog() {
    await umbConfirmModal(this, {
      headline: this.#localize.term(
        "workflow_contentReviews_contentRequiresReview"
      ),
      content: this.#localize.term(
        "workflow_contentReviews_contentRequiresReviewDescription"
      ),
      cancelLabel: this.#localize.term("general_close"),
      confirmLabel: this.#localize.term("general_ok"),
    }).catch(() => {});
  }

  async execute() {
    await this.#init;
    if (!this.#workflowManagerContext || !this.#workspaceContext) return;

    const result = await umbOpenModal(
      this,
      WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL
    ).catch(() => {});

    if (!result) return;

    const { reviewDate } = result;
    if (!reviewDate) return;

    const { error } = await tryExecute(
      this,
      ContentReviewService.putContentReviewReview({
        body: {
          document: {
            culture: this.#workflowManagerContext.getActiveCulture() ?? "",
            unique: this.#workspaceContext.getUnique()!,
          },
          dueOn: reviewDate,
        },
      })
    );

    if (!error) {
      this.#workflowManagerContext.refreshScaffold();
    }
  }
}

export { WorkflowMarkReviewedWorkspaceAction as api };
