import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  WorkflowInstanceResponseModel,
  WorkflowPermissionResponseModel,
  WorkflowTaskResponseModel} from "@umbraco-workflow/generated";
import {
  TaskStatusModel
} from "@umbraco-workflow/generated";

export type WorkflowTaskModelWithCss = {
  groupClass?: string;
} & WorkflowTaskResponseModel;

const elementName = "workflow-timeline";

@customElement(elementName)
export class WorkflowTimelineElement extends UmbElementMixin(LitElement) {
  @property({ type: Object })
  item?: WorkflowInstanceResponseModel;

  @state()
  tasks: Array<WorkflowTaskModelWithCss> = [];

  @state()
  totalSteps = 0;

  @state()
  permissions: Array<WorkflowPermissionResponseModel> = [];

  #awaitingResubmissionStr = this.localize.term(
    "workflow_awaitingResubmission"
  );

  #plusMoreStr = this.localize.term("workflow_plusMore");

  connectedCallback() {
    super.connectedCallback();

    this.tasks =
      (this.item?.tasks?.sort((a, b) =>
        a.currentStep! > b.currentStep! ? 1 : -1
      ) as Array<WorkflowTaskModelWithCss>) ?? [];

    this.totalSteps = this.item?.instance?.totalSteps ?? 0;
    this.permissions = this.item?.permissions ?? [];

    this.#addPendingTasks();
  }

  #addPendingTasks() {
    // can't count steps, as reject/resubmit use the same step number - instead, get unique step numbers
    const activeSteps = this.tasks
      .map((t) => t.currentStep)
      .filter((v, i, s) => s.indexOf(v) === i);

    // if permissions are missing (group deleted), stuff a mock permission in at the correct index
    if (this.permissions.length < this.totalSteps) {
      const missingIndexes: Array<WorkflowPermissionResponseModel> = [];

      this.permissions.forEach((p) => {
        missingIndexes[p.permission!] = p;
      });

      for (let i = 0; i < missingIndexes.length; i += 1) {
        if (!missingIndexes[i]) {
          this.permissions.splice(i, 0, {
            groupName: "Group does not exist",
            permission: 666,
          });
        }
      }
    }

    if (activeSteps.length < this.totalSteps) {
      for (let i = activeSteps.length; i < this.totalSteps; i += 1) {
        this.tasks.push({
          currentStep: i,
          groupName: this.permissions[i]?.groupName ?? "",
          completedBy: ""
        });
      }
    }

    // if a rejected task is the last in its step, stuff a fake pending resubmission and pending approval task
    // the responsible user will be the requestedBy value on the task
    this.tasks.forEach((task, i) => {
      if (
        task.status === TaskStatusModel.REJECTED &&
        (this.tasks[i + 1]?.currentStep === task.currentStep! + 1 ||
          !this.tasks[i + 1])
      ) {
        this.tasks.splice(i + 1, 0, {
          currentStep: task.currentStep,
          status: TaskStatusModel.AWAITING_RESUBMISSION,
          groupName: task.groupName, // TODO => add requestedBy to task items
          completedBy: "",
        });
      }
    });

    // once everything is up to date, iterate again, and set the group classes
    // if a rejection string hits more than 5 stages, collapse these to avoid the progress bar growing horribly
    this.tasks.forEach((task, i) => {
      const prev = this.tasks[i - 1];
      const next = this.tasks[i + 1];
      let str = "";

      if ((prev && task.currentStep !== prev.currentStep) || !prev) {
        str = "grouped-start";
      }

      if (next) {
        str +=
          task.currentStep !== next.currentStep ? " grouped-end" : " grouped";
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
        completedBy: "",
        currentStep: 0,
        groupName: (this.#plusMoreStr || "plus %0% more").replace(
          "%0%",
          (endTaskIndex - i - 1).toString()
        ),
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
        --tooltip-display: none!important;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTimelineElement;
  }
}
