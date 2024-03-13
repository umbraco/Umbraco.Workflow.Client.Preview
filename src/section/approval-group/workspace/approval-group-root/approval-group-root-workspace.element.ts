import {
  LitElement,
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS } from "../../collection/manifests.js";

const elementName = "workflow-approval-group-root-workspace";

@customElement(elementName)
export class ApprovalGroupRootWorkspaceElement extends UmbElementMixin(
  LitElement
) {
  render() {
    return html`<umb-body-layout main-no-padding headline="Approval groups">
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
