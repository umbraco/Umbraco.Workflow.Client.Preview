import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { WorkflowSettingsWorkspaceViewBase } from "./settings-workspace-view-base.element.js";
import { WorkspaceWithSettingsViewBase } from "@umbraco-workflow/core";

const elementName = "workflow-settings-settings-workspace-view";

@customElement(elementName)
export class WorkflowSettingsSettingsViewElement
  extends WorkflowSettingsWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  get newNodeApprovalFlow() {
    return this._generalSettings?.newNodeApprovalFlow;
  }

  get documentTypeApprovalFlows() {
    return this._generalSettings?.documentTypeApprovalFlows;
  }

  get excludeNodes() {
    return this._generalSettings?.excludeNodes;
  }

  #renderNewNodeApprovalFlow() {
    if (!this.newNodeApprovalFlow) return;

    return html`<uui-box>
      <div slot="headline">
        ${this.localize.term("workflow_newNodeApprovalFlow")}
        <small slot="header"
          >${this.localize.term(
            "workflow_newNodeApprovalFlowDescription"
          )}</small
        >
      </div>
      <workflow-new-node-flow></workflow-new-node-flow>
    </uui-box>`;
  }

  #renderDocumentTypeApprovalFlows() {
    if (!this.documentTypeApprovalFlows) return;

    return html`<uui-box>
      <div slot="headline">
        ${this.localize.term("workflow_documentTypeApprovalFlows")}
        <small
          >${this.localize.term(
            "workflow_documentTypeApprovalFlowsDescription"
          )}</small
        >
      </div>
      <workflow-document-type-flow></workflow-document-type-flow>
    </uui-box>`;
  }

  #renderExcludeNodes() {
    if (!this.excludeNodes) return;

    return html` <uui-box>
      <div slot="headline">
        ${this.localize.term("workflow_excludeNodes")}
        <small>${this.localize.term("workflow_excludeNodesDescription")}</small>
      </div>
      <workflow-exclude-nodes></workflow-exclude-nodes>
    </uui-box>`;
  }

  render() {
    return html`<workflow-license-alert></workflow-license-alert
      >${this.renderNoneSomeAllBanner(this._generalSettings)}
      <div id="flexyboi">
        <uui-box headline=${this.localize.term("general_general")}>
          ${this.renderPropertyDataSet(
            "generalSettings",
            this._generalSettings?.properties
          )}
        </uui-box>
        <div id="sidebar">
          ${this.#renderNewNodeApprovalFlow()}
          ${this.#renderDocumentTypeApprovalFlows()}
          ${this.#renderExcludeNodes()}
        </div>
      </div>`;
  }

  static styles = [
    ...WorkspaceWithSettingsViewBase.styles,
    css`
      @media (min-width: 750px) and (max-width: 899px), (min-width: 1500px) {
        #main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 0 var(--uui-size-10);
        }
      }
    `,
  ];
}

export default WorkflowSettingsSettingsViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsSettingsViewElement;
  }
}
