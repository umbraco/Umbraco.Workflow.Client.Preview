import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-content-reviews-editor";

@customElement(elementName)
export class WorkflowContentReviewsEditorElement extends UmbLitElement {
  render() {
    return html`<umb-workspace-editor
      alias="Workflow.Workspace.ContentReviews"
      .headline=${this.localize.term("workflow_treeHeaders_contentReviews")}
    >
    </umb-workspace-editor>`;
  }
}

export default WorkflowContentReviewsEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsEditorElement;
  }
}
