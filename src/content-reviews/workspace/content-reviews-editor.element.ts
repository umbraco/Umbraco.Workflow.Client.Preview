import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-content-reviews-editor";

@customElement(elementName)
export class WorkflowContentReviewsEditorElement extends UmbElementMixin(
  LitElement
) {
  render() {
    return html`<umb-workspace-editor
      alias="Workflow.Workspace.ContentReviews"
      .headline=${this.localize.term("treeHeaders_contentReviews")}
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
