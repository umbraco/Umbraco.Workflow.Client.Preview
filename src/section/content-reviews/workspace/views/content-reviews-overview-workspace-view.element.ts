import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import type { TableQueryModel } from "../../../../core/entities.js";
import { WorkspaceWithSettingsViewBase } from "../../../../section/workspace-with-settings-view-base.element.js";
import { WorkflowSettingsWorkspaceViewBase } from "../../../settings/workspace/views/settings-workspace-view-base.element.js";
import type { FilterModel } from "@umbraco-workflow/generated";
import { ContentReviewService } from "@umbraco-workflow/generated";
import type {
  FilterPickerElement,
  PageSizeDropdownElement,
} from "@umbraco-workflow/components";
import { ContentReviewFilters } from "@umbraco-workflow/components";
import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";

const elementName = "workflow-content-reviews-overview-workspace-view";

@customElement(elementName)
export class WorkflowContentReviewsOverviewWorkspaceViewElement
  extends WorkspaceWithSettingsViewBase
  implements UmbWorkspaceViewElement
{
  @state()
  model!: TableQueryModel;

  headline = this.localize.term("treeHeaders_contentReviews");

  perPage = 10;

  filters?: FilterModel;
  #filterConfig = new ContentReviewFilters(undefined, [
    "status",
    "completedDate",
  ]);

  async connectedCallback() {
    super.connectedCallback();

    this.#fetch();
  }

  #fetch(event?: CustomEvent) {
    this.perPage =
      (event?.target as PageSizeDropdownElement)?.value ?? this.perPage;

    this.model = {
      count: this.perPage,
      page: 1,
      filters: this.filters,
      handler: ContentReviewService.postContentReviewNodes,
    };
  }

  #handleFilterChange(event: CustomEvent) {
    const filters = (event.target as FilterPickerElement).value;
    if (!filters) return;

    this.filters = filters;
    this.#fetch();
  }

  render() {
    return html`<workflow-license-alert></workflow-license-alert
      ><uui-box>
        <div slot="header-actions">
          <workflow-filter-picker
            @change=${this.#handleFilterChange}
            .config=${this.#filterConfig}
          >
          </workflow-filter-picker>
          <workflow-page-size
            @change=${this.#fetch}
            .value=${this.perPage}
          ></workflow-page-size>
        </div>
        <content-reviews-table .model=${this.model}></content-reviews-table>
      </uui-box>`;
  }

  static styles = [
    BoxHeaderFlexStyles,
    ...WorkflowSettingsWorkspaceViewBase.styles,
  ];
}

export default WorkflowContentReviewsOverviewWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsOverviewWorkspaceViewElement;
  }
}
