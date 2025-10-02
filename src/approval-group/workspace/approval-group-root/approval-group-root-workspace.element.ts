import {
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS } from "../../collection/constants.js";

const elementName = "workflow-approval-group-root-workspace";

@customElement(elementName)
export class ApprovalGroupRootWorkspaceElement extends UmbLitElement {
  render() {
    return html`<umb-body-layout
      main-no-padding
      .headline=${this.localize.term("workflow_approvalGroups")}
    >
      <umb-collection
        alias=${WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS}
      ></umb-collection>
    </umb-body-layout>`;
  }
}

export default ApprovalGroupRootWorkspaceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupRootWorkspaceElement;
  }
}
