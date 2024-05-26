import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import {
  customElement,
  html,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  ChartBaseElement,
  type ChartHeaderCard,
} from "./chart-base.element.js";
import { ChartBaseStyles } from "./chart-style.styles.js";
import {
  ChartService,
  WorkflowStatusModel,
  type ChartResponseModel,
} from "@umbraco-workflow/generated";

const elementName = "content-reviews-chart";

@customElement(elementName)
export class ContentReviewsChartElement extends ChartBaseElement {
  #headerCardKeys = [
    { key: "Reviewed", value: WorkflowStatusModel.APPROVED.toLowerCase() },
    { key: "Overdue", value: WorkflowStatusModel.ERRORED.toLowerCase() },
    {
      key: "Expiring",
      value: WorkflowStatusModel.PENDING_APPROVAL.toLowerCase(),
    },
  ];

  buildChartSeries(chartData?: ChartResponseModel) {
    this.headerCards = [];
    this.#headerCardKeys.forEach((k) => {
      const lower = k.key.toLowerCase();

      this.headerCards.push({
        static: true,
        status: k.value,
        label: k.key,
        value: this.numberFormat(
          <number>(chartData?.additionalData ?? {})[`${lower}Count`] ?? 0,
          chartData?.currentUserLocale
        ),
      });
    });

    this.series = chartData?.series ?? [];
    this.drawChart(
      <number>chartData?.additionalData?.expiringCount > 100
        ? "logarithmic"
        : "linear"
    );
  }

  async getForRange() {
    if (this.range <= 0) return;

    this.loaded = false;

    const { data, error } = await tryExecuteAndNotify(
      this,
      ChartService.getChartContentReviewChart({
        range: this.range,
      })
    );

    if (error) {
      return;
    }

    this.buildChartSeries(data);
  }

  #renderChartHeader() {
    return html`<div id="chartHeader">
      ${repeat(
        this.headerCards,
        (card: ChartHeaderCard) => card,
        (card: ChartHeaderCard) => html`<workflow-chart-header-card
          .card=${card}
        ></workflow-chart-header-card>`
      )}
    </div>`;
  }

  render() {
    return html` ${when(
        this.loaded,
        () => this.#renderChartHeader(),
        () => html` <umb-load-indicator></umb-load-indicator> `
      )}
      <canvas id="chart" width="400" height="50"></canvas>`;
  }

  static styles = [ChartBaseStyles];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsChartElement;
  }
}
