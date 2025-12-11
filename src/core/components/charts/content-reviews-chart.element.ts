import { tryExecute } from "@umbraco-cms/backoffice/resources";
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
import {
  ChartService,
  type ChartResponseModel,
} from "@umbraco-workflow/generated";

const elementName = "content-reviews-chart";

@customElement(elementName)
export class ContentReviewsChartElement extends ChartBaseElement {
  #headerCardKeys = ["approved", "errored", "pending"];

  buildChartSeries(chartData?: ChartResponseModel) {
    this.headerCards = [];

    const mapKey = (k: string) => k === "errored" ? "overdue" : k === "pending" ? "expiring" : "reviewed";

    this.#headerCardKeys.forEach((k) => {
      const lower = mapKey(k.toLowerCase());

      this.headerCards.push({
        static: true,
        status: lower,
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

    const { data, error } = await tryExecute(
      this,
      ChartService.getChartContentReviewChart({ query: { range: this.range } })
    );

    if (!data || error) {
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
      <div id="chartContainer">
        <canvas id="chart" width="400" height="50"></canvas>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentReviewsChartElement;
  }
}
