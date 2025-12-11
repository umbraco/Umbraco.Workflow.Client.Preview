import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import {
  customElement,
  html,
  state,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowSettingsWorkspaceViewBase } from "./settings-workspace-view-base.element.js";
import { NotificationsSettingsModel } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT } from "../settings-workspace.context-token.js";

const elementName = "workflow-settings-notifications-workspace-view";

@customElement(elementName)
export class WorkflowSettingsNotificationsViewElement
  extends WorkflowSettingsWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  @state()
  private _settings?: NotificationsSettingsModel;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT,
      (context) => {
        this.observe(
          context?.notificationsSettings,
          (settings) => (this._settings = settings)
        );
      }
    );
  }

  async #installTemplates() {
    this.workspaceContext?.installEmailTemplates();
  }

  render() {
    return html`<workflow-license-alert></workflow-license-alert>
      ${this.renderNoneSomeAllBanner(this._settings)}
      <div id="flexyboi">
        <uui-box headline=${this.localize.term("workflow_notifications")}>
          ${this.renderPropertyDataSet(
            "notificationsSettings",
            this._settings?.properties
          )}
        </uui-box>
        <div id="sidebar">
          <uui-box>
            <div slot="headline">
              ${this.localize.term("workflow_emailTemplates")}
              <small
                >${unsafeHTML(
                  this.localize.term("workflow_settings_sendToDescription")
                )}</small
              >
            </div>
            <workflow-email-templates></workflow-email-templates>

            <p>
              ${this.localize.term(
                "workflow_settings_installEmailTemplatesDescription"
              )}
            </p>
            <uui-button
              look="secondary"
              color="default"
              label="Install"
              @click=${this.#installTemplates}
            >
              ${this.localize.term("workflow_settings_installEmailTemplates")}
            </uui-button>
          </uui-box>
        </div>
      </div>`;
  }
}

export default WorkflowSettingsNotificationsViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsNotificationsViewElement;
  }
}
