import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import { ValidActionDescriptor, WorkflowStatus } from "@umbraco-workflow/core";
import {
  WORKFLOW_REJECT_TASK_MODAL,
  type WorkflowActionButtonsElement,
} from "@umbraco-workflow/editor-view";

import type { WorkflowTaskModel } from "@umbraco-workflow/generated";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";

const elementName = "workflow-actions";

@customElement(elementName)
export class WorkflowActionsElement extends UmbElementMixin(LitElement) {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  workflowState?: WorkflowState;

  @state()
  currentTask?: WorkflowTaskModel;

  @state()
  comment? = "";

  @state()
  commentInvalid? = true;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;

      this.#workflowManagerContext = context;
      this.observe(
        observeMultiple([context.currentTask, context.state]),
        ([currentTask, state]) => {
          this.currentTask = currentTask;
          this.workflowState = state;
          this.commentInvalid = this.workflowState?.requireComment;
        }
      );
    });
  }

  #handleCommentChange(e: CustomEvent) {
    this.comment = e.detail.comment;
    this.commentInvalid = e.detail.invalid && !this.workflowState?.isAdmin;
  }

  get controlLabelSuffix() {
    if (!this.workflowState || this.workflowState.canAction) {
      return "";
    }

    let suffix =
      this.workflowState?.isAdmin &&
      !this.workflowState?.canAction &&
      !this.workflowState?.canResubmit
        ? `(${this.localize.term("workflow_asAdmin")})`
        : "";

    if (
      this.currentTask?.status === WorkflowStatus.REJECTED &&
      this.workflowState?.canResubmit
    ) {
      suffix = "";
    }

    return suffix;
  }

  #action(action?: ValidActionDescriptor, assignTo?: string) {
    if (action === undefined) return;

    this.#workflowManagerContext?.action(action, this.comment, assignTo);
    this.comment = "";
  }

  async #reject() {
    // when rejecting, can chose any of the previous groups, but we
    // will auto select the first group if this is the first workflow task
    // state holds all the permissions, and knows which are active
    const activePermissions =
      this.#workflowManagerContext?.getActivePermissions() ?? [];

    const activeIndex = activePermissions.findIndex(
      (x) => x.groupKey === this.currentTask?.groupId
    );

    if (activeIndex === 0) {
      this.#action(ValidActionDescriptor.REJECT, "user");
      return;
    }

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_REJECT_TASK_MODAL, {
      data: {
        groups: activePermissions.slice(0, activeIndex),
        requestedBy: this.currentTask?.instance?.requestedBy,
      },
    });

    await modalHandler.onSubmit().catch(() => undefined);
    const value = modalHandler.getValue();
    if (!value.assignTo) return;

    this.#action(ValidActionDescriptor.REJECT, value.assignTo);
  }

  #renderWorkflowActions() {
    return html`
      <workflow-comments
        labelKey="workflow_addComment"
        ?mandatory=${this.workflowState?.requireComment}
        .comment=${this.comment}
        @change=${this.#handleCommentChange}
      >
      </workflow-comments>

      <umb-property-layout
        orientation="vertical"
        .label=${this.localize.term("workflow_action", this.controlLabelSuffix)}
      >
        <workflow-action-buttons
          slot="editor"
          ?disabled=${this.commentInvalid}
          @action=${(e) =>
            this.#action((e.target as WorkflowActionButtonsElement)?.action)}
          @reject=${this.#reject}
        ></workflow-action-buttons>
      </umb-property-layout>
    `;
  }

  render() {
    return html`
      <uui-box headline=${this.localize.term("workflow_action")}>
        ${when(
          this.workflowState?.userCanActionTask(),
          () => this.#renderWorkflowActions(),
          () => html`<workflow-alert
            key="workflow_userCannotAction"
          ></workflow-alert>`
        )}
      </uui-box>
    `;
  }

  static styles = [
    css`
      [slot="editor"] {
        display: flex;
        gap: var(--uui-size-space-2);
      }

      #goToNodeBtn {
        margin-left: auto;
      }

      umb-property-layout {
        padding-bottom: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowActionsElement;
  }
}
