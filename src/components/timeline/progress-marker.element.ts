import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  ifDefined,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { WorkflowTaskModelWithCss } from "./timeline.element.js";
import { getStatusFromString } from "@umbraco-workflow/core";
import { TaskStatusModel } from "@umbraco-workflow/generated";

const elementName = "workflow-progress-marker";

@customElement(elementName)
export class WorkflowProgressMarkerElement extends UmbElementMixin(LitElement) {
  @property({ type: Object })
  task?: WorkflowTaskModelWithCss;

  connectedCallback() {
    super.connectedCallback();

    // eslint-disable-next-line wc/no-self-class
    this.classList.add(
      `status-${this.task?.status?.toLowerCase() || "future"}`
    );
  }

  #getIconName(task: WorkflowTaskModelWithCss) {
    switch (task.status) {
      case TaskStatusModel.APPROVED:
        return "check";
      case TaskStatusModel.CANCELLED:
      case TaskStatusModel.REJECTED:
        return "delete";
      case TaskStatusModel.PENDING_APPROVAL:
      case TaskStatusModel.AWAITING_RESUBMISSION:
        return "pause";
      case TaskStatusModel.RESUBMITTED:
        return "play";
    }

    return "";
  }

  render() {
    if (!this.task) return null;

    return html` <div class=${ifDefined(this.task?.groupClass)}>
      <span id="marker">
        <uui-icon .name=${this.#getIconName(this.task)}></uui-icon>
      </span>
      <span id="tooltip">
        <span
          >${this.localize.term(getStatusFromString(this.task.status))}</span
        >
        ${this.task.status === TaskStatusModel.RESUBMITTED ||
        this.task.status === TaskStatusModel.REJECTED
          ? this.task.completedBy
          : this.task.groupName}
      </span>
    </div>`;
  }

  static styles = [
    css`
      :host {
        text-align: center;
        position: relative;
        flex: 1;
        z-index: 4050;
        --uui-icon-color: white;
        --marker-size: var(--uui-size-7);
        --tooltip-color: white;
        --step-color: var(--workflow-default);
      }

      :host::before,
      :host::after {
        content: "";
        height: 3px;
        position: absolute;
        top: 9px;
        width: calc(100% - 20px);
      }

      :host::before {
        left: calc(-50% + 10px);
        background: linear-gradient(90deg, transparent, var(--step-color));
      }

      :host::after {
        left: calc(50% + 10px);
        background: linear-gradient(90deg, var(--step-color), transparent);
      }

      :host(:last-child)::after {
        width: calc(50% - var(--uui-size-4));
        background: var(--step-color);
      }

      :host(:first-child)::before {
        width: 50%;
        left: 0;
        background: var(--step-color);
      }

      :host(.status-approved) {
        --step-color: var(--workflow-approved);
      }
      :host(.status-rejected) {
        --step-color: var(--workflow-rejected);
        --tooltip-color: var(--workflow-pending);
      }
      :host(.status-awaitingresubmission),
      :host(.status-pendingapproval) {
        --step-color: var(--workflow-pending);
      }
      :host(.status-notrequired) {
        --tooltip-color: var(--uui-color-current-contrast);
      }
      :host(.status-resubmitted) {
        --step-color: var(--workflow-resubmitted);
      }
      :host(.status-cancelled) {
        --step-color: var(--workflow-cancelled);
        --tooltip-color: var(--workflow-pending);
      }
      :host(.collapsed) {
        --step-color: var(--workflow-default);
        --tooltip-color: var(--workflow-pending);
      }
      :host(.status-future) {
        --tooltip-color: #000;
      }

      .grouped-start.grouped-end::before,
      .grouped-start.grouped-end::after {
        display: none;
      }

      .grouped::before,
      .grouped::after,
      .grouped-start::before,
      .grouped-start::after,
      .grouped-end::before,
      .grouped-end::after {
        content: "";
        display: block;
        position: absolute;
        top: -2px;
        bottom: -2px;
        background: linear-gradient(0, #eee, transparent, #eee);
      }

      .grouped:not(.grouped-end)::after,
      .grouped-start::after {
        left: calc(50% - var(--uui-size-4));
        right: 0;
      }

      .grouped:not(.grouped-start)::before,
      .grouped-end::before {
        left: 0;
        right: calc(50% - var(--uui-size-4));
      }

      .grouped-start::after {
        border-radius: var(--uui-size-4) 0 0 var(--uui-size-4);
      }

      .grouped-end::before {
        border-radius: 0 var(--uui-size-4) var(--uui-size-4) 0;
      }

      #marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--marker-size);
        height: var(--marker-size);
        border-radius: 50%;
        margin: 0 auto;
        background: var(--step-color);
        position: relative;
        z-index: 5050;
        background: var(--step-color);
      }

      #marker:hover + #tooltip {
        display: var(--tooltip-display, block);
        position: absolute;
        bottom: calc(100% + var(--uui-size-2));
        left: 50%;
        transform: translateX(-50%);
        opacity: 1;
      }

      #tooltip {
        font-size: 12px;
        line-height: 1.2;
        display: none;
        background: var(--step-color);
        padding: 5px;
        color: var(--tooltip-color, #fff);
        border-radius: var(--uui-border-radius);
      }

      #tooltip::after {
        content: "";
        width: 2px;
        height: var(--uui-size-4);
        background: var(--step-color);
        position: absolute;
        top: 100%;
        left: calc(50% - 1px);
      }

      #tooltip > span {
        text-transform: uppercase;
        display: block;
      }

      uui-icon {
        width: 17px;
        height: 17px;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowProgressMarkerElement;
  }
}
