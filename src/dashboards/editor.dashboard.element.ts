import {
  LitElement,
  css,
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  ContentReviewService,
  InstanceService,
} from "@umbraco-workflow/generated";
import { WorkflowDetailModalRouterController } from "@umbraco-workflow/core";

const elementName = "workflow-editor-dashboard";

@customElement(elementName)
export class EditorDashboardElement extends UmbElementMixin(LitElement) {
  constructor() {
    super();
    new WorkflowDetailModalRouterController(this);
  }

  render() {
    return html`
      <workflow-table .headline=${this.localize.term(
        "workflow_myTasks"
      )} .config=${{
      handler: InstanceService.postInstanceAssignedTo,
    }}>
        <workflow-instances-table
          ></workflow-instances-table>
        </uui-box>
      </workflow-table>

      <workflow-table .headline=${this.localize.term(
        "workflow_mySubmissions"
      )} .config=${{
      handler: InstanceService.postInstanceInitiatedBy,
    }}>
        <workflow-instances-table
          ></workflow-instances-table>
        </uui-box>
      </workflow-table>

      <workflow-table .headline=${this.localize.term(
        "contentReviews_staleContent"
      )} .config=${{
      handler: ContentReviewService.postContentReviewNodes,
      hiddenColumns: ["period", "reviewGroup"],
    }}>
        <workflow-instances-table
          ></workflow-instances-table>
        </uui-box>
      </workflow-table>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }

      workflow-table + * {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default EditorDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: EditorDashboardElement;
  }
}
