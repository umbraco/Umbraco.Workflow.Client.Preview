import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { SettingsStatusModel } from "../../entities.js";

const elementName = "workflow-settings-disabled-alert";

@customElement(elementName)
export class WorkflowSettingsDisabledAlertElement extends UmbLitElement {
  @property({ type: Object })
  statuses: SettingsStatusModel = {
    someDisabled: false,
    allDisabled: false,
    allHidden: false,
  };

  render() {
    return html`<workflow-alert
      .key=${"workflow_settingsHiddenOrReadonly"}
      .tokens=${[
        this.localize.term(
          this.statuses.allDisabled ? "general_all" : "workflow_some"
        ),
      ]}
    ></workflow-alert>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        margin-bottom: var(--uui-size-space-6);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsDisabledAlertElement;
  }
}
