import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { ChartHeaderCard } from "./chart-base.element.js";
import { WorkflowColorStyles } from "../../css/index.js";

const elementName = "workflow-chart-header-card";

@customElement(elementName)
export class ChartHeaderCardElement extends UmbLitElement {
  @property({ type: Object })
  card!: ChartHeaderCard;

  cardClick(event: Event) {
    this.card.action?.({ $event: event });
  }

  render() {
    const status = this.card.status?.toLowerCase();

    return when(
      this.card.static,
      () => html` <div
        class="chart-header-card background-status-${status} color-status-${status}"
      >
        <span class="jumbo">${this.card.value}</span>
        <span>${this.localize.term(`workflow_${status}`)}</span>
      </div>`,
      () => html`<button
        type="button"
        @click=${this.cardClick}
        class="chart-header-card background-status-${status} color-status-${status}"
      >
        <uui-icon
          name="info"
          title="Click to view workflows by state: ${status}"
        ></uui-icon>
        <span class="jumbo">${this.card.value}</span>
        <span>${this.localize.term(`workflow_${status}`)}</span>
      </button>`
    );
  }

  static styles = [
    WorkflowColorStyles,
    css`
      .chart-header-card {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        border-radius: var(--uui-border-radius);
        padding: var(--uui-size-5) var(--uui-size-6);
        border: none;
        text-align: center;
        line-height: 1;
        text-transform: uppercase;
        cursor: pointer;
      }

      uui-icon {
        position: absolute;
        top: var(--uui-size-2);
        right: var(--uui-size-2);
      }

      .jumbo {
        font-weight: bold;
        width: 100%;
        font-size: var(--uui-size-16);
      }

      /* recolor */
      .color-approved {
        fill: var(--workflow-approved);
        color: var(--workflow-approved);
      }

      .color-cancelled {
        fill: var(--workflow-cancelled);
        color: var(--workflow-cancelled);
      }

      .color-resubmitted {
        fill: var(--workflow-resubmitted);
        color: var(--workflow-resubmitted);
      }

      .color-rejected {
        fill: var(--workflow-rejected);
        stroke: var(--workflow-rejected);
        color: var(--workflow-rejected);
      }

      .color-notreq {
        fill: var(--workflow-notreq);
        color: var(--workflow-notreq);
      }

      .color-pending {
        stroke: var(--workflow-pending);
        fill: var(--workflow-pending);
        color: var(--workflow-pending);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ChartHeaderCardElement;
  }
}
