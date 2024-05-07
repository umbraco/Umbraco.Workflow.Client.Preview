import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import {
  css,
  customElement,
  html,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { ChartBaseStyles } from "./chart-style.styles.js";
import {
  ChartBaseElement,
  type ChartHeaderCard,
} from "./chart-base.element.js";
import {
  type WorkflowInstancesFilterModel,
  WorkflowStatus,
} from "@umbraco-workflow/core";
import {
  type ChartResponseModel,
  ChartService,
  WorkflowStatusModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-activity-chart";

@customElement(elementName)
export class WorkflowActivityChartElement extends ChartBaseElement {
  averageSeconds!: number;
  minSeconds!: number;
  maxSeconds!: number;

  showStatsBox!: boolean;

  statusValues = [
    { key: "Approved", value: WorkflowStatusModel.APPROVED.toLowerCase() },
    { key: "Cancelled", value: WorkflowStatusModel.CANCELLED.toLowerCase() },
    { key: "Errored", value: WorkflowStatusModel.ERRORED.toLowerCase() },
    {
      key: "Pending",
      value: WorkflowStatusModel.PENDING_APPROVAL.toLowerCase(),
    },
  ];

  constructor() {
    super();
  }

  // TODO => humanize
  humanize = (x: number) => x;

  buildChartSeries(chartData?: ChartResponseModel) {
    this.headerCards = [];

    this.statusValues.forEach((s) => {
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

    this.showStatsBox = chartData?.additionalData?.averageSeconds !== 0 || true;

    if (this.showStatsBox) {
      this.minSeconds = this.humanize(
        <number>chartData?.additionalData?.minSeconds ?? 0
      );
      this.maxSeconds = this.humanize(
        <number>chartData?.additionalData?.maxSeconds ?? 0
      );
      this.averageSeconds = this.humanize(
        <number>chartData?.additionalData?.averageSeconds ?? 0
      );
    }

    this.series = chartData?.series ?? [];
    this.drawChart("linear");
  }

  async getForRange() {
    if (this.range <= 0) return;

    this.loaded = false;

    const { data, error } = await tryExecuteAndNotify(
      this,
      ChartService.getChartWorkflowChart({
        range: this.range,
        groupId: this.groupId,
      })
    );

    if (error) {
      return;
    }

    this.buildChartSeries(data);
  }

  getActivity(filter: string) {
    const f = this.statusValues.find((x) => x.key === filter);
    const o: WorkflowInstancesFilterModel = {
      status: [],
    };

    if (f) {
      // if filtering pending, include rejected and resubmitted
      if (filter !== "Pending") {
        o.status = [f.value];
      } else {
        o.status = [
          WorkflowStatus.PENDING_APPROVAL,
          WorkflowStatus.REJECTED,
          WorkflowStatus.NOT_REQUIRED,
        ];
      }
    }

    // if the key is NOT pending, filter by items completed inside the current range
    // if (filter !== "Pending") {
    //   let from = this.dateHelper.convertToServerStringTime(
    //     this.earliest,
    //     0
    //     // TODO => servertimeoffset
    //     //Umbraco.Sys.ServerVariables.application.serverTimeOffset
    //   );
    //   o.completedFrom = from;
    // }

    // TODO => do we care?
    //this.wfWorkflowResource.setActivityFilter(o);

    // TODO => ServerVars
    // this.$window.location.href = Umbraco.Sys.ServerVariables.umbracoSettings.umbracoPath +
    //   '/#/workflow/history/overview';
  }

  #renderStatsBox() {
    return html`<div id="statsBox">
      <ul id="statsList">
        <li>
          <strong
            ><umb-localize key="workflow_fastestApproval"
              >Fastest approval</umb-localize
            >:</strong
          >
          <span>${this.minSeconds}</span>
        </li>
        <li>
          <strong
            ><umb-localize key="workflow_slowestApproval"
              >Slowest approval</umb-localize
            >:</strong
          >
          <span>${this.maxSeconds}</span>
        </li>
        <li>
          <strong
            ><umb-localize key="workflow_averageApproval"
              >Average approval</umb-localize
            >:</strong
          >
          <span>${this.averageSeconds}</span>
        </li>
      </ul>
    </div>`;
  }

  #renderChartHeader() {
    return html`<div id="chartHeader">
      ${this.headerCards.map(
        (card: ChartHeaderCard) => html`<workflow-chart-header-card
          .card=${card}
        ></workflow-chart-header-card>`
      )}
      ${when(this.showStatsBox, () => this.#renderStatsBox())}
    </div>`;
  }

  render() {
    return html` ${when(
        this.loaded,
        () => this.#renderChartHeader(),
        () => html`<umb-load-indicator></umb-load-indicator>`
      )}
      <canvas id="chart" width="400" height="50"></canvas>`;
  }

  static styles = [
    ChartBaseStyles,
    css`
      #statsHeader {
        list-style-type: none;
        margin: 0 -7.5px;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
      }

      #statsBox {
        background: #fff;
        padding: 15px;
        border-radius: 3px;
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
