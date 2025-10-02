import {
  classMap,
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UmbHistoryItemElement } from "@umbraco-cms/backoffice/components";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  TaskService,
  type WorkflowTaskCollectionItemModel,
  type WorkflowTaskCollectionModel,
} from "@umbraco-workflow/generated";
import { WorkflowStatus } from "@umbraco-workflow/core";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-task-list";

@customElement(elementName)
export class WorkflowTaskListElement extends UmbLitElement {
  #workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  loaded = false;

  @state()
  tasks: Array<WorkflowTaskCollectionModel> = [];

  @property()
  unique?: string;

  @property()
  comment?: string | null;

  @property()
  status?: string | null;

  connectedCallback() {
    super.connectedCallback();

    if (this.unique) {
      this.#fetch();
      return;
    }

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      this.#workflowManagerContext = context;
      this.#observeScaffold();
    });
  }

  #observeScaffold() {
    if (!this.#workflowManagerContext) return;

    this.observe(this.#workflowManagerContext.scaffold, (scaffold) => {
      if (!scaffold) return;

      const instance = scaffold.tasks?.invariantTask?.instance;
      this.comment = instance?.comment;
      this.status = instance?.status;
      this.unique = instance?.key;

      this.#fetch();
    }, 'scaffoldObserver');
  }

  async #fetch() {
    if (!this.unique) return;

    const { data } = await tryExecute(
      this,
      TaskService.getTaskById({ path: { id: this.unique }})
    );

    this.tasks = data?.taskCollection ?? [];
    this.loaded = true;
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
    const classes = {
      "history-tasks": true,
      linked: !!task.linked,
      future: !!task.future,
      "not-required":
        task.status === WorkflowStatus.NOT_REQUIRED ||
        task.status === WorkflowStatus.EXCLUDED,
    };

    return html`<div class=${classMap(classes)}>
      <workflow-task-info
        .name=${task.actionedByName}
        .date=${task.actionedOn}
        .comment=${task.status !== WorkflowStatus.NOT_REQUIRED
          ? task.comment
          : null}
        ?admin=${task.actionedByAdmin}
        indent
      >
        <uui-tag slot="tag" .color=${this.#getTagColor(task.status)}
          >${this.localize.term(`workflow_status${task.status}`)}
        </uui-tag>
      </workflow-task-info>
    </div>`;
  }

  #renderTaskListItem(task: WorkflowTaskCollectionModel) {
    return html`<li
      class="${task.future || task.status === WorkflowStatus.NOT_REQUIRED
        ? "future"
        : ""}"
    >
      <workflow-task-list-stage-header
        .task=${task}
      ></workflow-task-list-stage-header>

      ${when(
        task.items?.length,
        () => task.items?.map((t) => this.#renderNestedTaskItem(t)),
        () =>
          html` <workflow-task-info
            avatar="!"
            name=${this.localize.term("workflow_groupHasNoMembers")}
          ></workflow-task-info>`
      )}
    </li>`;
  }

  render() {
    return html`<uui-box
      .headline=${this.localize.term("workflow_workflowActivity")}
    >
      ${when(
        this.loaded,
        () => html` <workflow-status-block
            .comment=${this.comment}
            .status=${this.status}
          ></workflow-status-block>
          <ul id="tasklist">
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
      }

      workflow-status-block {
        display: block;
        margin-bottom: var(--uui-size-3);
      }

      #tasklist {
        padding: 0;
        margin: 0;
        list-style-type: none;
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

      .future {
        opacity: 0.5;
      }

      .future .future {
        opacity: 1;
      }

      .not-required {
        opacity: 0.5;
      }

      .linked::before {
        content: "";
        display: block;
        position: absolute;
        left: 15px;
        top: 8px;
        height: calc(100% + 8px);
        width: 2px;
        background: var(--uui-color-current);
      }

      .history-tasks {
        position: relative;
      }

      .history-tasks + .history-tasks {
        margin-top: var(--uui-size-space-3);
      }

      workflow-task-info + workflow-task-info {
        margin-top: var(--uui-size-4);
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
