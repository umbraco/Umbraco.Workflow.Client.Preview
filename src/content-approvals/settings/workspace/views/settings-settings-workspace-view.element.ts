import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { spread } from "@open-wc/lit-helpers";
import { WorkflowSettingsWorkspaceViewBase } from "./settings-workspace-view-base.element.js";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import { WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT } from "../settings-workspace.context-token.js";
import { GeneralSettingsModel } from "@umbraco-workflow/generated";
import { WorkspaceWithSettingsViewBaseElement } from "@umbraco-workflow/settings";

const elementName = "workflow-settings-settings-workspace-view";

@customElement(elementName)
export class WorkflowSettingsSettingsViewElement
  extends WorkflowSettingsWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  @state()
  private _settings?: GeneralSettingsModel;

  #historyCleanupEnabled?: boolean;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this.#historyCleanupEnabled =
        context?.getVariables()?.historyCleanupEnabled ?? false;
    });

    this.consumeContext(
      WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT,
      (instance) => {
        this.observe(
          instance?.generalSettings,
          (settings) => (this._settings = settings)
        );
      }
    );
  }

  #renderNewNodeApprovalFlow() {
    if (!this._settings?.newNodeApprovalFlow) return;

    return html`<uui-box
      ${spread(this.getAttributes(this._settings.newNodeApprovalFlow))}
    >
      <div slot="headline">
        ${this.localize.term("workflow_settings_newNodeApprovalFlow")}
        <small slot="header"
          >${this.localize.term(
            "workflow_settings_newNodeApprovalFlowDescription"
          )}</small
        >
      </div>
      <workflow-new-node-flow></workflow-new-node-flow>
    </uui-box>`;
  }

  #renderDocumentTypeApprovalFlows() {
    if (!this._settings?.documentTypeApprovalFlows) return;

    return html`<uui-box
      ${spread(this.getAttributes(this._settings.documentTypeApprovalFlows))}
    >
      <div slot="headline">
        ${this.localize.term("workflow_settings_documentTypeApprovalFlows")}
        <small
          >${this.localize.term(
            "workflow_settings_documentTypeApprovalFlowsDescription"
          )}</small
        >
      </div>
      <workflow-document-type-flow
        .config=${{ add: true }}
      ></workflow-document-type-flow>
    </uui-box>`;
  }

  #renderExcludeNodes() {
    if (!this._settings?.excludeNodes) return;

    return html` <uui-box
      ${spread(this.getAttributes(this._settings.excludeNodes))}
    >
      <div slot="headline">
        ${this.localize.term("workflow_settings_excludeNodes")}
        <small
          >${this.localize.term(
            "workflow_settings_excludeNodesDescription"
          )}</small
        >
      </div>
      <workflow-exclude-nodes></workflow-exclude-nodes>
    </uui-box>`;
  }

  render() {
    return html`<workflow-license-alert></workflow-license-alert
      >${this.renderNoneSomeAllBanner(this._settings)}
      <div id="flexyboi">
        <uui-box headline=${this.localize.term("general_general")}>
          ${this.renderPropertyDataSet(
            "generalSettings",
            this._settings?.properties
          )}
        </uui-box>
        <div id="sidebar">
          ${this.#renderNewNodeApprovalFlow()}
          ${this.#renderDocumentTypeApprovalFlows()}
          ${this.#renderExcludeNodes()}
          ${when(
            this.#historyCleanupEnabled,
            () => html` <workflow-history-cleanup></workflow-history-cleanup>`
          )}
        </div>
      </div>`;
  }

  static styles = [
    ...WorkspaceWithSettingsViewBaseElement.styles,
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
