import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import {
  customElement,
  html,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowSettingsWorkspaceViewBase } from "./settings-workspace-view-base.element.js";
import { WorkspaceWithSettingsViewBase } from "@umbraco-workflow/core";

const elementName = "workflow-settings-notifications-workspace-view";

@customElement(elementName)
export class WorkflowSettingsNotificationsViewElement
  extends WorkflowSettingsWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  get emailTemplates() {
    return this._notificationsSettings?.emailTemplates;
  }

  async #installTemplates() {
    this.workspaceContext?.installEmailTemplates();
  }

  render() {
    return html`<workflow-license-alert></workflow-license-alert>
      ${this.renderNoneSomeAllBanner(this._notificationsSettings)}
      <div id="flexyboi">
        <uui-box headline=${this.localize.term("workflow_notifications")}>
          ${this.renderPropertyDataSet(
            "notificationsSettings",
            this._notificationsSettings?.properties
          )}
        </uui-box>
        <div id="sidebar">
          <uui-box>
            <div slot="headline">
              ${this.localize.term("workflow_emailTemplates")}
              <small
                >${unsafeHTML(
                  this.localize.term("workflow_sendToDescription")
                )}</small
              >
            </div>
            <workflow-email-templates></workflow-email-templates>

            <p>
              ${this.localize.term("workflow_installEmailTemplatesDescription")}
            </p>
            <uui-button
              look="secondary"
              color="default"
              label="Install"
              @click=${this.#installTemplates}
            >
              ${this.localize.term("workflow_installEmailTemplates")}
            </uui-button>
          </uui-box>
        </div>
      </div>`;
  }

  static styles = [...WorkspaceWithSettingsViewBase.styles];
}

export default WorkflowSettingsNotificationsViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsNotificationsViewElement;
  }
}
