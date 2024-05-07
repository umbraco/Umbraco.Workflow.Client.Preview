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
import { ValidActionDescriptor, WorkflowStatus } from "@umbraco-workflow/core";
import { WORKFLOW_REJECT_TASK_MODAL } from "@umbraco-workflow/editor-view";
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

  @state()
  currentAction?: ValidActionDescriptor;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (instance) => {
      if (!instance) return;

      this.#workflowManagerContext = instance;
      this.#observeState();
      this.#observeCurrentTask();
    });
  }

  #observeCurrentTask() {
    this.observe(this.#workflowManagerContext!.currentTask, (currentTask) => {
      this.currentTask = currentTask;
    });
  }

  #observeState() {
    this.observe(this.#workflowManagerContext!.state, (workflowState) => {
      console.log("state observer");
      this.workflowState = workflowState;
      this.commentInvalid = this.workflowState?.requireComment;
    });
  }

  #userCanActionTask() {
    console.log(this.workflowState);
    return (
      this.workflowState?.canAction ||
      this.workflowState?.isAdmin ||
      this.workflowState?.canResubmit ||
      this.workflowState?.isChangeAuthor
    );
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

  #action(action: ValidActionDescriptor, assignTo?: string) {
    this.currentAction = action;

    this.#workflowManagerContext?.action(
      this.currentAction,
      this.comment,
      assignTo
    );

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

    const { assignTo } = await modalHandler.onSubmit();
    if (!assignTo) return;

    this.#action(ValidActionDescriptor.REJECT, assignTo);
  }

  #goToNode() {
    //     this.navigationService.changeSection('content');
    // this.$location.path(`/content/content/edit/${this.state.nodeId}`);
    // this.eventsService.emit(constants.events.goToNode);
  }

  get canAction() {
    return (
      (this.workflowState?.canAction || this.workflowState?.isAdmin) &&
      !this.workflowState?.rejected
    );
  }

  get canCancel() {
    return (
      this.workflowState?.canAction ||
      this.workflowState?.isAdmin ||
      this.workflowState?.isChangeAuthor
    );
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

      <umb-workspace-property-layout
        .label=${`${this.localize.term("workflow_action")} ${
          this.controlLabelSuffix
        }`}
      >
        <div slot="editor">
          ${when(
            this.canAction,
            () => html` <uui-button
              ?disabled=${this.commentInvalid}
              @click=${() => this.#action(ValidActionDescriptor.APPROVE)}
              look="primary"
              color="positive"
              label="Approve"
              >${this.localize.term("workflow_approve")}
            </uui-button>`
          )}
          ${when(
            this.workflowState?.canResubmit,
            () => html` <uui-button
              ?disabled=${this.commentInvalid}
              look="primary"
              color="positive"
              @click=${() => this.#action(ValidActionDescriptor.RESUBMIT)}
              label="Resubmit"
              >${this.localize.term("workflow_resubmit")}
            </uui-button>`
          )}
          ${when(
            this.canAction,
            () => html` <uui-button
              ?disabled=${this.commentInvalid}
              @click=${() => this.#reject()}
              look="primary"
              color="warning"
              label="Reject"
              >${this.localize.term("workflow_reject")}
            </uui-button>`
          )}
          ${when(
            this.canCancel,
            () => html` <uui-button
              ?disabled=${this.commentInvalid}
              @click=${() => this.#action(ValidActionDescriptor.CANCEL)}
              look="primary"
              color="danger"
              label="Cancel"
              >${this.localize.term("general_cancel")}
            </uui-button>`
          )}
          ${when(
            !this.workflowState?.offline && this.workflowState?.isDashboard,
            () => html` <uui-button
              id="goToNodeBtn"
              look="primary"
              @click=${this.#goToNode}
              label="Go to node"
              >${this.localize.term("workflow_editButton")}
            </uui-button>`
          )}
        </div>
      </umb-workspace-property-layout>
    `;
  }

  render() {
    return html`
      <uui-box headline=${this.localize.term("workflow_action")}>
        ${when(
          this.#userCanActionTask(),
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

      umb-workspace-property-layout {
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
