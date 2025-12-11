import {
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WorkflowStatus } from "../../../enums.js";
import type { WorkflowTaskCollectionModel } from "@umbraco-workflow/generated";

const elementName = "workflow-task-list-stage-header";

@customElement(elementName)
export class WorkflowTaskListStageHeaderElement extends UmbLitElement {
  @property({ type: Object })
  task?: WorkflowTaskCollectionModel;

  #getStageDescription() {
    if (!this.task?.items?.length || !this.task?.approvalsRequired) return null;

    let description = this.localize.term(
      "workflow_xOfYApprovalsCompleted",
      this.task.approvalCount?.toString(),
      this.task.approvalsRequired
    );

    if (
      this.task.actionedByAdmin &&
      this.task.status !== WorkflowStatus.PENDING_APPROVAL &&
      this.task.status !== WorkflowStatus.REJECTED
    ) {
      description += ` - ${this.localize
        .term("workflow_completedByAdmin")
        .toLowerCase()}`;
    }

    return html`<small>${description}</small>`;
  }

  #getStageHeader() {
    if (!this.task) return;

    return html`<strong
      >${this.localize.term("workflow_stage")} ${this.task.approvalStep + 1} -
      ${this.task.group.name}
    </strong>`;
  }

  render() {
    return html` <div>
        ${this.#getStageHeader()} ${this.#getStageDescription()}
      </div>
      ${when(
        this.task?.status === WorkflowStatus.NOT_REQUIRED,
        () => html` <uui-tag class="status-4"
          >${this.localize.term(`workflow_status${this.task?.status}`)}
        </uui-tag>`
      )}`;
  }

  static styles = css`
    :host {
      display: flex;
      margin-bottom: var(--uui-size-2);
    }

    small {
      line-height: 1;
      margin-bottom: 6px;
    }

    :host > div {
      display: flex;
      flex-direction: column;
      margin-right: auto;
    }

    uui-tag {
      align-self: center;
    }
  `;
}

export default WorkflowTaskListStageHeaderElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowTaskListStageHeaderElement;
  }
}
