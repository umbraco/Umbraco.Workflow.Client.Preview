import {
  LitElement,
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { PackageVersionModel } from "@umbraco-workflow/generated";

const elementName = "workflow-admin-dashboard";

@customElement(elementName)
export class AdminDashboardElement extends UmbElementMixin(LitElement) {
  // TODO => populate this!
  version?: PackageVersionModel;

  @state()
  chartRange = 28;

  @state()
  reviewsChartRange = 28;

  #updateChartRange($event: CustomEvent) {
    this.chartRange = $event.detail.value;
  }

  #updateReviewsChartRange($event: CustomEvent) {
    this.reviewsChartRange = $event.detail.value;
  }

  #packageModal = () => {
    // TODO => ServerVars?
    // const marketplaceUrl = new URL(
    //   "Umbraco.Sys.ServerVariables.umbracoUrls.marketplaceUrl"
    // ).origin;
    // this.editorService.open({
    //   view: `${Umbraco.Sys.ServerVariables.UmbracoWorkflow.viewsPath}overlays/iframe.overlay.html`,
    //   url: `${marketplaceUrl}/embed/umbraco.workflow`,
    //   submitButtonLabelKey: 'general_close',
    //   size: constants.sizes.l,
    //   submit: () => this.editorService.close(),
    //   close: () => this.editorService.close(),
    // });
  };

  #renderOutOfDate() {
    if (!this.version?.outOfDate) return null;

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

        <button
          type="button"
          @click=${() => this.#packageModal()}
          class="btn btn-info ml-auto"
        >
          <umb-localize key="workflow_learnMoreAbout"
            >Learn more about</umb-localize
          >
          v${this.version.latestVersion}
        </button>
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
          .value=${this.chartRange}
          @change=${this.#updateChartRange}
        ></workflow-day-range>
      </div>
      <workflow-activity-chart
        .range=${this.chartRange}
      ></workflow-activity-chart>
    </uui-box>`;
  }

  #renderReviewsChart() {
    return html`<uui-box>
      <div slot="headline">
        ${this.localize.term("contentReviews_contentReviewActivity")}
      </div>
      <workflow-day-range
        slot="header-actions"
        @change=${this.#updateReviewsChartRange}
        [min]="7"
      ></workflow-day-range>
      <content-reviews-chart
        .range=${this.reviewsChartRange}
      ></content-reviews-chart>
    </uui-box>`;
  }

  #renderVersion() {
    if (!this.version) return null;

    return html`
      <div class="mt-5">
        <p>
          <umb-localize key="workflow_installedVersion"
            >Current installed version of Umbraco Workflow:</umb-localize
          >
          <strong>${this.version.installedVersion}</strong>
        </p>
      </div>
    `;
  }

  render() {
    return html`<workflow-license-box></workflow-license-box
      >${this.#renderOutOfDate()} ${this.#renderWorkflowChart()}
      ${this.#renderReviewsChart()} ${this.#renderVersion()}`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

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
