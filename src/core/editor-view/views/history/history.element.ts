import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_HISTORY_COLLECTION_ALIAS } from "@umbraco-workflow/content-approvals";

const elementName = "workflow-workspace-history";

@customElement(elementName)
export class WorkflowWorkspaceHistoryElement extends UmbLitElement {
  render() {
    return html`<umb-collection
      alias=${WORKFLOW_HISTORY_COLLECTION_ALIAS}
    ></umb-collection>`;
  }

  static styles = css`
    :host {
      --uui-size-layout-1: var(--uui-size-8);
    }
  `;
}

export default WorkflowWorkspaceHistoryElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceHistoryElement;
  }
}
