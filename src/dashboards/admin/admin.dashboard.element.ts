import {
  css,
  customElement,
  html,
  state,
  unsafeHTML,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UUIInputElement } from "@umbraco-cms/backoffice/external/uui";
import { type PackageVersionModel } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

import "./license-box/license-box.element.js";

const elementName = "workflow-admin-dashboard";

@customElement(elementName)
export class AdminDashboardElement extends UmbLitElement {
  @state()
  private _version?: PackageVersionModel;

  @state()
  private _licensed = false;

  @state()
  private _chartRange = 28;

  @state()
  private _reviewsChartRange = 28;

  async connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this._licensed = context?.getLicense()?.isLicensed ?? false;
      this._version = context?.getVersion() ?? undefined;
    });
  }

  #updateChartRange($event: CustomEvent) {
    this._chartRange = Number(($event.target as UUIInputElement).value);
  }

  #updateReviewsChartRange($event: CustomEvent) {
    this._reviewsChartRange = Number(($event.target as UUIInputElement).value);
  }

  #renderOutOfDate() {
    if (!this._version?.outOfDate) return null;

    return html`<div>
      <div class="alert alert-info flex items-center">
        <div class="mr-auto">
          <strong
            ><umb-localize key="workflow_updateAvailable"
              >Update available</umb-localize
            >:
          </strong>
          <umb-localize key="workflow_outOfDate"
            >Workflow is out of date.</umb-localize
          >
        </div>
      </div>
    </div>`;
  }

  #renderWorkflowChart() {
    return html`<uui-box>
      <div slot="headline">
        ${this.localize.term("workflow_activity")}
        </div>
        <workflow-day-range
          slot="header-actions"
          .value=${this._chartRange}
          @change=${this.#updateChartRange}
        ></workflow-day-range>
      </div>
      <workflow-activity-chart
        .range=${this._chartRange}
      ></workflow-activity-chart>
    </uui-box>`;
  }

  #renderReviewsChart() {
    return html`<uui-box>
      <div slot="headline">
        ${this.localize.term("workflow_contentReviews_contentReviewActivity")}
      </div>
      <workflow-day-range
        slot="header-actions"
        .value=${this._reviewsChartRange}
        @change=${this.#updateReviewsChartRange}
      ></workflow-day-range>
      <content-reviews-chart
        .range=${this._reviewsChartRange}
      ></content-reviews-chart>
    </uui-box>`;
  }

  #renderVersion() {
    if (!this._version) return null;

    return html`
      <div id="version">
        ${unsafeHTML(
          this.localize.term(
            "workflow_installedVersion",
            this._version.installedVersion
          )
        )}
      </div>
    `;
  }

  render() {
    return html`${when(
      !this._licensed,
      () => html`<workflow-license-box></workflow-license-box>`
    )}${this.#renderOutOfDate()}
    ${this.#renderWorkflowChart()} ${this.#renderReviewsChart()}
    ${this.#renderVersion()}`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      #version,
      workflow-license-box:not([style]) + *,
      uui-box + * {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default AdminDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AdminDashboardElement;
  }
}
