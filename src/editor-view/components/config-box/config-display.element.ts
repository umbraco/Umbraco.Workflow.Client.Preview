import {
  customElement,
  html,
  property,
  unsafeHTML,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowConfigBoxBase } from "./index.js";
import { PermissionType } from "src/core/enums.js";

const elementName = "workflow-config-display";

@customElement(elementName)
export class WorkflowConfigDisplayElement extends WorkflowConfigBoxBase {
  @property()
  approvalType!: PermissionType.CONTENT_TYPE | PermissionType.INHERITED;

  get headline() {
    if (this.approvalType === PermissionType.CONTENT_TYPE) {
      return this.localize.term("workflow_docTypeApprovalFlow");
    }

    return this.localize.term("workflow_inheritedApprovalFlow");
  }

  get empty() {
    if (this.approvalType === PermissionType.CONTENT_TYPE) {
      return this.localize.term("workflow_noDoctypeFlow");
    }

    return this.localize.term("workflow_noInheritedFlow");
  }

  #renderDescription() {
    if (this.approvalType !== PermissionType.INHERITED) return null;

    return html`<p>
      ${unsafeHTML(
        this.localize.term(
          "workflow_currentPageInheritsFrom",
          this.permissions?.inherited?.at(0)?.nodeName ?? ""
        )
      )}
    </p>`;
  }

  #renderPermissions() {
    return html`<uui-ref-list>
      ${this.permissions?.[this.approvalType]?.map(
        (permission) =>
          html`<workflow-ref-group-permission
            .name=${`Stage ${permission.permission! + 1}: ${
              permission.groupName
            }`}
          >
          </workflow-ref-group-permission>`
      )}
    </uui-ref-list>`;
  }

  render() {
    return html` <uui-box
      headline=${this.headline}
      class=${this.activeType === this.approvalType ? "active" : ""}
      licensed
    >
      ${this.renderActiveBadge(this.approvalType)}
      ${when(
        this.permissions?.[this.approvalType]?.length,
        () => html`${this.#renderDescription()}${this.#renderPermissions()}`,
        () =>
          when(
            this.empty,
            () => html` <workflow-alert>${this.empty}</workflow-alert>`
          )
      )}
    </uui-box>`;
  }

  static styles = [...WorkflowConfigBoxBase.styles];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfigDisplayElement;
  }
}
