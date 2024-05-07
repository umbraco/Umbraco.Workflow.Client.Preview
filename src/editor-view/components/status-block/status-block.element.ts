import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import {
  LitElement,
  css,
  customElement,
  html,
  nothing,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  getCommentParts,
  getStatusFromString,
  TaskStatus,
} from "@umbraco-workflow/core";
import { WORKFLOW_GROUP_DETAIL_MODAL } from "@umbraco-workflow/editor-view";
import {
  type WorkflowTaskModel,
  TaskStatusModel,
} from "@umbraco-workflow/generated";
import { WorkflowColorStyles } from "@umbraco-workflow/css";

const elementName = "workflow-status-block";

@customElement(elementName)
export class WorkflowStatusBlockElement extends UmbElementMixin(LitElement) {
  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Object })
  task?: WorkflowTaskModel;

  @state()
  errorMessage?: string;

  @property()
  status?: string;

  protected firstUpdated() {
    const { errorMessage } = getCommentParts(this.task?.comment);
    this.errorMessage = errorMessage;

    if (this.task?.status) {
      if (this.task.status === TaskStatus.REJECTED) {
        this.status = TaskStatusModel.AWAITING_RESUBMISSION;
      } else {
        this.status = Object.values(TaskStatusModel)[this.task.status];
      }
    }
  }

  async #showGroupDetails() {
    if (!this.task) throw new Error("task is missing");

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    modalContext.open(this, WORKFLOW_GROUP_DETAIL_MODAL, {
      data: {
        group: this.task.userGroup!,
        isAdmin: this.isAdmin,
      },
    });
  }

  render() {
    return html`<uui-box class="background-status-${this.status?.toLowerCase()}"
      ><div
        class="status-block ${this.status !== TaskStatusModel.ERRORED &&
        !this.errorMessage
          ? "--centered"
          : nothing}"
      >
        <p
          .class=${this.status === TaskStatusModel.ERRORED && this.errorMessage
            ? "--bordered"
            : nothing}
        >
          ${this.localize.term(getStatusFromString(this.status))}
        </p>

        ${when(
          this.status === TaskStatusModel.ERRORED && this.errorMessage,
          () => html` <div>${this.errorMessage}</div>`
        )}
        ${when(
          this.status === TaskStatusModel.PENDING_APPROVAL ||
            this.status === TaskStatusModel.AWAITING_RESUBMISSION,
          () =>
            when(
              this.task?.userGroup?.users?.length,
              () => html`<div>
                <uui-button
                  @click=${this.#showGroupDetails}
                  label="Open group: ${this.task?.userGroup?.name}"
                >
                  ${this.task?.userGroup?.name}
                </uui-button>
              </div>`,
              () => html`${this.task?.userGroup?.name}`
            )
        )}
      </div></uui-box
    > `;
  }

  static styles = [
    WorkflowColorStyles,
    css`
      .status-block {
        display: flex;
        flex-direction: column;
      }

      .--centered {
        justify-content: center;
        align-items: center;
      }

      .--bordered {
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      }

      p {
        text-transform: uppercase;
        margin: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowStatusBlockElement;
  }
}
