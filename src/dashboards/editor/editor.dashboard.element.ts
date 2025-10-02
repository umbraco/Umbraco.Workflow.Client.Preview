import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  ContentReviewService,
  InstanceService,
} from "@umbraco-workflow/generated";
import { WorkflowDetailModalRouterController } from "@umbraco-workflow/core";

const elementName = "workflow-editor-dashboard";

@customElement(elementName)
export class EditorDashboardElement extends UmbLitElement {
  constructor() {
    super();
    new WorkflowDetailModalRouterController(this);
  }

  render() {
    return html` <workflow-table
        .headline=${this.localize.term("workflow_myTasks")}
        .config=${{
          handler: InstanceService.postInstanceAssignedTo,
          hiddenColumns: ["status"],
        }}
      >
        <workflow-instances-table></workflow-instances-table>
      </workflow-table>

      <workflow-table
        .headline=${this.localize.term("workflow_mySubmissions")}
        .config=${{
          handler: InstanceService.postInstanceInitiatedBy,
          hiddenColumns: ["status"],
        }}
      >
        <workflow-instances-table></workflow-instances-table>
      </workflow-table>

      <workflow-table
        .headline=${this.localize.term("contentReviews_staleContent")}
        .config=${{
          handler: ContentReviewService.postContentReviewNodes,
        }}
      >
        <content-reviews-table></content-reviews-table>
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
