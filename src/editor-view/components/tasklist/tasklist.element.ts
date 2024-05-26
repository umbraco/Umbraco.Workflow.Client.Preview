import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UmbHistoryItemElement } from "@umbraco-cms/backoffice/components";
import { WorkflowStatus } from "@umbraco-workflow/core";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import {
  type WorkflowTaskCollectionItemModel,
  type WorkflowTaskCollectionModel,
  TaskService,
} from "@umbraco-workflow/generated";

const elementName = "workflow-task-list";

@customElement(elementName)
export class WorkflowTaskListElement extends UmbElementMixin(LitElement) {
  @state()
  loaded = false;

  @state()
  tasks: Array<WorkflowTaskCollectionModel> = [];

  @property()
  unique?: string;

  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  connectedCallback() {
    super.connectedCallback();

    if (!this.unique) {
      this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (instance) => {
        if (!instance) return;
        this.#workflowManagerContext = instance;
        this.#observeCurrentTask();
      });
    } else {
      this.#fetch();
    }
  }

  #observeCurrentTask() {
    if (!this.#workflowManagerContext) return;

    this.observe(this.#workflowManagerContext.ready, (ready) => {
      if (!ready) return;
      this.#fetch();
    });
  }

  async #fetch() {
    const id = this.unique ?? this.#workflowManagerContext?.getInstanceUnique();
    if (!id) return;

    const { data } = await tryExecuteAndNotify(
      this,
      TaskService.getTaskById({ id })
    );

    this.tasks = data?.taskCollection ?? [];
    this.loaded = true;
  }

  #getStageDescription(task: WorkflowTaskCollectionModel) {
    if (!task.items?.length || !task.approvalsRequired) return null;

    let description = this.localize.term(
      "workflow_xOfYApprovalsCompleted",
      task.approvalCount?.toString(),
      task.approvalsRequired
    );

    if (
      task.actionedByAdmin &&
      task.status !== WorkflowStatus.PENDING_APPROVAL &&
      task.status !== WorkflowStatus.REJECTED
    ) {
      description += ` - ${this.localize
        .term("workflow_completedByAdmin")
        .toLowerCase()}`;
    }

    return html`<small>${description}</small>`;
  }

  #getStageHeader(task: WorkflowTaskCollectionModel) {
    return html`<strong
      >${this.localize.term("workflow_stage")} ${task.approvalStep! + 1} -
      ${task.groupName ?? this.localize.term("workflow_noGroup")}
    </strong>`;
  }

  #getTagColor(status?: number | null) {
    switch (status) {
      case WorkflowStatus.APPROVED:
        return "positive";
      case WorkflowStatus.CANCELLED:
      case WorkflowStatus.REJECTED:
        return "warning";
      case WorkflowStatus.ERRORED:
        return "danger";
      default:
        return "default";
    }
  }

  #renderNestedTaskItem(task: WorkflowTaskCollectionItemModel) {
    return html`<div
      class="history-tasks ${task.linked ? "--linked" : ""} ${task.future ||
      task.status === WorkflowStatus.NOT_REQUIRED ||
      task.status === WorkflowStatus.EXCLUDED
        ? "--future"
        : ""}"
    >
      <div class="wrapper">
        <div class="user-info">
          <uui-avatar name=${task.actionedByName ?? ""}> </uui-avatar>
          <div>
            <span class="name"
              >${task.actionedByName}
              ${when(
                task.actionedByAdmin,
                () => html` (${this.localize.term("workflow_asAdmin")})`
              )}</span
            >
            ${when(
              task.actionedOn,
              () => html` <span class="detail"> ${task.actionedOn} </span>`
            )}
          </div>
        </div>
        <uui-tag .color=${this.#getTagColor(task.status)}
          >${this.localize.term(`workflow_status${task.status}`)}
        </uui-tag>
      </div>

      ${when(
        task.comment && task.status !== WorkflowStatus.NOT_REQUIRED,
        () => html` <p class="comment">${task.comment}</p> `
      )}
    </div>`;
  }

  #renderTaskListItem(task: WorkflowTaskCollectionModel) {
    return html`<li
      class="${task.future || task.status === WorkflowStatus.NOT_REQUIRED
        ? "--future"
        : ""}"
    >
      <div class="stage-header">
        <div>
          ${this.#getStageHeader(task)} ${this.#getStageDescription(task)}
        </div>
        ${when(
          task.status === WorkflowStatus.NOT_REQUIRED,
          () => html` <uui-tag class="status-4"
            >${this.localize.term(`workflow_status${task.status}`)}
          </uui-tag>`
        )}
      </div>

      ${when(task.status !== WorkflowStatus.NOT_REQUIRED, () =>
        task.items?.map((t) => this.#renderNestedTaskItem(t))
      )}
      ${when(
        !task.items?.length && task.status !== WorkflowStatus.NOT_REQUIRED,
        () => html` <div class="user-info">
          <uui-avatar style="background-color:var(--uui-color-warning)" name="!"
            >!</uui-avatar
          >
          ${this.localize.term("workflow_groupHasNoMembers")}
        </div>`
      )}
    </li>`;
  }

  render() {
    return html`<uui-box
      .headline=${this.localize.term("workflow_workflowActivity")}
    >
      ${when(
        this.loaded,
        () => html` <ul id="tasklist">
          ${this.tasks.map((task) => this.#renderTaskListItem(task))}
        </ul>`,
        () => html`<uui-loader></uui-loader>`
      )}
    </uui-box>`;
  }

  static styles = [
    UmbHistoryItemElement.styles,
    css`
      :host {
        display: block;
        margin-top: var(--uui-size-space-5);
      }

      #tasklist {
        padding: 0;
        margin: 0;
        list-style-type: none;
      }

      .comment {
        font-style: italic;
        margin: 12px 0 0 calc(2em + 4px + var(--uui-size-space-5));
      }

      li {
        margin-bottom: var(--uui-size-space-4);
        display: flex;
        flex-direction: column;
        position: relative;
      }

      li:last-child {
        margin-bottom: 0;
      }

      .wrapper,
      .stage-header {
        display: flex;
      }

      uui-tag {
        margin-left: auto;
        align-self: center;
      }

      .stage-header small {
        line-height: 1;
        margin-bottom: 6px;
      }

      .stage-header > div {
        display: flex;
        flex-direction: column;
        margin-right: auto;
      }

      .--future {
        opacity: 0.5;
      }

      .--future .--future {
        opacity: 1;
      }

      .--linked::before {
        content: "";
        display: block;
        position: absolute;
        left: 15px;
        top: 8px;
        height: calc(100% + 8px);
        width: 2px;
        background: var(--uui-color-current);
      }

      .user-info:not(:has(.detail)) {
        align-items: center;
      }

      .history-tasks {
        position: relative;
      }

      .history-tasks + .history-tasks {
        margin-top: var(--uui-size-space-3);
      }
    `,
  ];
}

export default WorkflowTaskListElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTaskListElement;
  }
}
