import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import type { WorkflowInstanceTableResponseModel } from "@umbraco-workflow/generated";
import { WorkflowTagColorStyles } from "@umbraco-workflow/css";

const elementName = "workflow-instances-table-progress-column-layout";

@customElement(elementName)
export class WorkflowInstancesTableProgressColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: WorkflowInstanceTableResponseModel;

  @state()
  private _progress?: number;

  private _current?: number;
  private _completedTaskCount?: number;
  private _totalSteps?: number;

  connectedCallback() {
    super.connectedCallback();

    this._totalSteps =
      this.value.tasks[this.value.tasks.length - 1].permission + 1;

    const lastApprovedStep = this.value.tasks.findLast(
      (x) => x.status === "Approved"
    )?.permission;
    this._completedTaskCount =
      lastApprovedStep !== undefined ? lastApprovedStep + 1 : 0;

    this._current = (1 / this._totalSteps) * 100;
    this._progress = (this._completedTaskCount / this._totalSteps) * 100;
  }

  render() {
    return html` <workflow-progress-bar
        style=${`--current-task-background-color: var(--workflow-${this.value.status.toLowerCase()})`}
        progress=${this._progress ?? 0}
        current=${this._current ?? 0}
      >
      </workflow-progress-bar>
      <small
        >${this.localize.term(
          "workflow_completedXofY",
          this._completedTaskCount,
          this._totalSteps
        )}
      </small>`;
  }

  static styles = [
    WorkflowTagColorStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-3) 0;
      }

      small {
        margin-top: var(--uui-size-2);
        line-height: 1.3;
        text-align: right;
        display: block;
        opacity: 0.6;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowInstancesTableProgressColumnLayoutElement;
  }
}
