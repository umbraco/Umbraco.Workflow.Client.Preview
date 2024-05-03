import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

import type {
  ChartTypeRegistry} from "chart.js";
import {
  Chart,
  LineController,
  BarController,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  CategoryScale,
  LogarithmicScale,
  Tooltip,
} from "chart.js";
import type {
  PropertyValueMap} from "@umbraco-cms/backoffice/external/lit";
import {
  LitElement,
  property,
  query,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { ChartDataPointModel, ChartSeriesModel } from "@umbraco-workflow/generated";

export type ChartHeaderCard = {
  action?: ({ $event }: { $event: Event }) => void;
  label: string;
  value: string;
  status?: string;
  background?: string;
  static?: boolean;
}

export class ChartBaseElement extends UmbElementMixin(LitElement) {
  @property()
  groupId?: string;

  static get properties() {
    return { range: { type: Number } };
  }

  set range(value: number) {
    this._range = value;
    this.getForRange();
  }

  get range() {
    return this._range;
  }

  _range!: number;

  @state()
  loaded = false;

  @state()
  headerCards: Array<ChartHeaderCard> = [];

  @query("#chart")
  chartElement?: any;

  chart?: Chart<
    keyof ChartTypeRegistry,
    ChartDataPointModel[] | undefined,
    string
  >;

  earliest: any;
  now = new Date();
  series: Array<ChartSeriesModel> = [];

  constructor() {
    super();

    Chart.register(
      BarController,
      BarElement,
      LineController,
      LineElement,
      CategoryScale,
      LogarithmicScale,
      TimeScale,
      LinearScale,
      PointElement,
      Tooltip
    );
  }

  updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (_changedProperties.get("range")) {
      this.getForRange();
    }
  }

  getForRange() {}

  /**
   *
   * @param {number} length - the array length
   * @param {Date} date - the starting date
   * @returns Array<ChartDataItem>
   */
  emptySeries = (length: number, date: Date): Array<ChartDataPointModel> =>
    Array.from({ length }, (_, i) => {
      const x = new Date(date);
      x.setDate(x.getDate() + i);
      return { x: x.toString(), y: 0 };
    });

  /**
   * @param {number} i - the number to format
   * @returns {Intl.NumberFormat}
   */
  numberFormat = (i: number, locale: string = "en-us") =>
    new Intl.NumberFormat(locale).format(i);

  /**
   *
   * @param {string} elementId - the ID of the element in which to render the chart
   * @param {string} yAxisType - one of 'linear' or 'logarithmic'
   */
  drawChart = (yAxisType): void => {
    if (!this.chartElement) {
      this.loaded = true;
      return;
    }

    this.chart?.destroy();

    Chart.defaults.scale.grid.display = false;

    this.earliest = new Date(this.series[0].data![0].x!);

    const labels = this.series[0].data!.map((x) => {
      const date = new Date(x.x!);
      return date === this.now ? "𝗧𝗼𝗱𝗮𝘆" : x.x!; // unicode bold
    });

    this.series.forEach(s => {
      s.label = this.localize.term(`workflow_${s.key}`);
    });

    this.chart = new Chart(this.chartElement.getContext("2d"), {
      data: {
        labels,
        datasets: this.series as any,
      },
      options: {
        interaction: {
          intersect: false,
          mode: 'index',
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            type: yAxisType,
            ticks: {
              stepSize: 1,
              maxTicksLimit: 5,
              callback: (value) => value.toString(),
            },
          },
          x: {
            beginAtZero: true,            
          },
        },
      },
    });

    this.loaded = true;
  };
}
