import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowColorStyles } from "../../css/workflow-color.styles.js";
import type { ChartHeaderCard } from "./chart-base.element.js";

const elementName = "workflow-chart-header-card";

@customElement(elementName)
export class ChartHeaderCardElement extends UmbElementMixin(LitElement) {
  @property({ type: Object })
  card!: ChartHeaderCard;

  cardClick(event: Event) {
    if (this.card.action) {
      this.card.action({ $event: event });
    }
  }

  render() {
    return when(
      this.card.static,
      () => html` <div
        class="chart-header-card background-status-${this.card
          .status} color-status-${this.card.status}"
      >
        <span class="jumbo">${this.card.value}</span>
        <span>${this.localize.term(this.card.label)}</span>
      </div>`,
      () => html`<button
        type="button"
        @click=${this.cardClick}
        class="chart-header-card background-status-${this.card
          .status} color-status-${this.card.status}"
      >
        <uui-icon
          name="info"
          title="Click to view history by state: ${this.card.label}"
        ></uui-icon>
        <span class="jumbo">${this.card.value}</span>
        <span>${this.localize.term(this.card.label)}</span>
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
        border-radius: var(--uui-size-1);
        padding: 15px 20px;
        text-align: center;
        border: 2px solid transparent;
        line-height: 1;
        text-transform: uppercase;
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
