import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import { WorkspaceWithSettingsViewBase ,type  TableQueryModel  } from "@umbraco-workflow/core";
import { ContentReviewService } from "@umbraco-workflow/generated";
import { ContentReviewFilters } from "@umbraco-workflow/components";

const elementName = "workflow-content-reviews-overview-workspace-view";

@customElement(elementName)
export class WorkflowContentReviewsOverviewWorkspaceViewElement
  extends WorkspaceWithSettingsViewBase
  implements UmbWorkspaceViewElement
{
  #config: TableQueryModel = {
    handler: ContentReviewService.postContentReviewNodes,
    filterConfig: new ContentReviewFilters(undefined, [
      "status",
      "completedDate",
    ]),
  };

  render() {
    return html`<workflow-license-alert></workflow-license-alert>
      <workflow-table .config=${this.#config}>
        <content-reviews-table></content-reviews-table>
      </workflow-table> `;
  }
}

export default WorkflowContentReviewsOverviewWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsOverviewWorkspaceViewElement;
  }
}
