import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  TaskStatusModel,
  type WorkflowInstanceTableTaskResponseModel,
  type WorkflowInstanceTableResponseModel,
} from "@umbraco-workflow/generated";

export type WorkflowTaskModelWithCss = {
  groupClass?: string;
} & WorkflowInstanceTableTaskResponseModel;

const elementName = "workflow-timeline";

@customElement(elementName)
export class WorkflowTimelineElement extends UmbLitElement {
  @property({ type: Object })
  item?: WorkflowInstanceTableResponseModel;

  @state()
  tasks: Array<WorkflowTaskModelWithCss> = [];

  connectedCallback() {
    super.connectedCallback();

    this.tasks = (this.item?.tasks as Array<WorkflowTaskModelWithCss>) ?? [];
    this.#addPendingTasks();
  }

  #addPendingTasks() {
    // if a rejected task is the last in its step, stuff a fake pending resubmission and pending approval task
    // the responsible user will be the requestedBy value on the task
    this.tasks.forEach((task, i) => {
      if (
        task.status === TaskStatusModel.REJECTED &&
        (this.tasks[i + 1]?.permission === task.permission! + 1 ||
          !this.tasks[i + 1])
      ) {
        this.tasks.splice(i + 1, 0, {
          permission: task.permission,
          status: TaskStatusModel.AWAITING_RESUBMISSION,
          group: {
            name: task.group!.name,
            unique: task.group!.unique,
          },
        });
      }
    });

    // once everything is up to date, iterate again, and set the group classes
    // if a rejection string hits more than 5 stages, collapse these to avoid the progress bar growing horribly
    this.tasks.forEach((task, i) => {
      const prev = this.tasks[i - 1];
      const next = this.tasks[i + 1];
      let str = "";

      if ((prev && task.permission !== prev.permission) || !prev) {
        str = "grouped-start";
      }

      if (next) {
        str +=
          task.permission !== next.permission ? " grouped-end" : " grouped";
      } else {
        str += " grouped-end";
      }

      task.groupClass = str;
    });

    // and iterate again :( to find each set of grouped tasks, remove the extras
    // to be left with grouped-start, collapsed, grouped-end
    this.tasks.forEach((task, i) => {
      if (task.groupClass !== "grouped-start grouped") return;

      // find the next grouped-end task
      const endTaskIndex = this.tasks.findIndex(
        (t, j) => j > i && t.groupClass?.includes("grouped-end")
      );

      // if it's more than two tasks away, we collapse to three tasks
      if (endTaskIndex - i < 3) return;

      const pad: WorkflowTaskModelWithCss = {
        status: TaskStatusModel.NULL,
        groupClass: "grouped collapsed",
        permission: 0,
        group: {
          name: this.localize.term(
            "workflow_plusMore",
            (endTaskIndex - i - 1).toString()
          ),
          unique: "",
        },
      };

      this.tasks.splice(i + 1, 0, pad);
      this.tasks.splice(i + 2, endTaskIndex - i - 1);
    });
  }

  render() {
    return this.tasks.map(
      (task) =>
        html`<workflow-progress-marker
          .task=${task}
        ></workflow-progress-marker>`
    );
  }

  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        margin: 0 var(--uui-size-2);
      }

      .workflow-progress-container {
        padding: 0 var(--uui-size-4) var(--uui-size-4);
        margin-top: -2px;
        position: relative;
      }

      .status-cancelled ~ workflow-progress-marker {
        --tooltip-display: none !important;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTimelineElement;
  }
}
