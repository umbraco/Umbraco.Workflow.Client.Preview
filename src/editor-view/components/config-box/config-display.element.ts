import {
  css,
  customElement,
  html,
  property,
  unsafeHTML,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowConfigBoxBase } from "./index.js";
import { PermissionType } from "@umbraco-workflow/core";

const elementName = "workflow-config-display";

@customElement(elementName)
export class WorkflowConfigDisplayElement extends WorkflowConfigBoxBase {
  @property()
  approvalType!: PermissionType.CONTENT_TYPE | PermissionType.INHERITED;

  get headline() {
    return this.localize.term(
      this.approvalType === PermissionType.CONTENT_TYPE
        ? "workflow_docTypeApprovalFlow"
        : "workflow_inheritedApprovalFlow"
    );
  }

  get empty() {
    return this.localize.term(
      this.approvalType === PermissionType.CONTENT_TYPE
        ? "workflow_noDoctypeFlow"
        : "workflow_noInheritedFlow"
    );
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
          html`<workflow-ref-group-permission .value=${permission}>
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

  static styles = [
    ...WorkflowConfigBoxBase.styles,
    css`
      uui-ref-list {
        pointer-events: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfigDisplayElement;
  }
}
