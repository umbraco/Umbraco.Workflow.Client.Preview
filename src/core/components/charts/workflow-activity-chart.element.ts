import { tryExecute } from "@umbraco-cms/backoffice/resources";
import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import humanizeDuration from "humanize-duration";
import {
  ChartBaseElement,
  type ChartHeaderCard,
} from "./chart-base.element.js";
import {
  type ChartResponseModel,
  ChartService,
  WorkflowStatusModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-activity-chart";

@customElement(elementName)
export class WorkflowActivityChartElement extends ChartBaseElement {
  @state()
  private _showStatsBox!: boolean;

  #averageSeconds!: string;
  #minSeconds!: string;
  #maxSeconds!: string;

  #statusValues = [
    { key: "Approved", value: WorkflowStatusModel.APPROVED.toLowerCase() },
    { key: "Cancelled", value: WorkflowStatusModel.CANCELLED.toLowerCase() },
    { key: "Errored", value: WorkflowStatusModel.ERRORED.toLowerCase() },
    {
      key: "Pending",
      value: WorkflowStatusModel.PENDING_APPROVAL.toLowerCase(),
    },
  ];

  #humanize = (x: number) => humanizeDuration(x, { round: true });

  #buildChartSeries(chartData?: ChartResponseModel) {
    this.headerCards = [];

    this.#statusValues.forEach((s) => {
      const lower = s.key.toLowerCase();

      this.headerCards.push({
        background: lower,
        status: s.value,
        action: () => this.getActivity(s.key),
        label: s.key,
        value: this.numberFormat(
          <number>(chartData?.additionalData ?? {})[`${lower}Count`] ?? 0,
          chartData?.currentUserLocale
        ),
      });
    });

    this._showStatsBox = chartData?.additionalData?.averageSeconds !== 0;

    if (this._showStatsBox) {
      this.#minSeconds = this.#humanize(
        <number>chartData?.additionalData?.minSeconds ?? 0
      );
      this.#maxSeconds = this.#humanize(
        <number>chartData?.additionalData?.maxSeconds ?? 0
      );
      this.#averageSeconds = this.#humanize(
        <number>chartData?.additionalData?.averageSeconds ?? 0
      );
    }

    this.series = chartData?.series ?? [];
    this.drawChart("linear");
  }

  async getForRange() {
    if (this.range <= 0) return;

    this.loaded = false;

    const { data, error } = await tryExecute(
      this,
      ChartService.getChartWorkflowChart({
        query: { range: this.range, groupId: this.groupId },
      })
    );

    if (!data || error) {
      return;
    }

    this.#buildChartSeries(data);
  }

  getActivity(filter: string) {
    if (filter === "Pending") {
      window.history.pushState(
        null,
        "",
        "/umbraco/section/workflow/workspace/active-workflows-root"
      );
      return;
    }

    const f = this.#statusValues.find((x) => x.key === filter);
    if (f) {
      const o = {
        status: f.value,
        from: new Date(Date.now() - this.range * 24 * 60 * 60 * 1000),
      };

      window.localStorage.setItem("workflow_historyFilter", JSON.stringify(o));
    }

    window.history.pushState(
      null,
      "",
      "/umbraco/section/workflow/workspace/workflow-history-root"
    );
  }

  #renderStatsBox() {
    if (!this._showStatsBox) return;

    return html`<div id="statsBox">
      <ul id="statsList">
        <li>
          <strong>${this.localize.term("workflow_fastestApproval")}:</strong>
          <span>${this.#minSeconds}</span>
        </li>
        <li>
          <strong>${this.localize.term("workflow_slowestApproval")}:</strong>
          <span>${this.#maxSeconds}</span>
        </li>
        <li>
          <strong>${this.localize.term("workflow_averageApproval")}:</strong>
          <span>${this.#averageSeconds}</span>
        </li>
      </ul>
    </div>`;
  }

  render() {
    return html` ${when(
        this.loaded,
        () => html`<div id="chartHeader">
          ${this.headerCards.map(
            (card: ChartHeaderCard) => html`<workflow-chart-header-card
              .card=${card}
            ></workflow-chart-header-card>`
          )}
          ${this.#renderStatsBox()}
        </div>`,
        () => html`<umb-load-indicator></umb-load-indicator>`
      )}
      <div id="chartContainer">
        <canvas id="chart" width="400" height="50"></canvas>
      </div>`;
  }

  static styles = [
    ...ChartBaseElement.styles,
    css`
      #statsHeader {
        list-style-type: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        column-gap: var(--uui-size-3);
      }

      #statsBox {
        padding: var(--uui-size-5);
        display: flex;
        align-items: center;
      }

      #statsList {
        margin: 0;
        padding: 0;
        list-style-type: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowActivityChartElement;
  }
}
