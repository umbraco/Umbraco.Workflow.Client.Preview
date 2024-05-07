import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { SettingsStatusModel } from "src/core/entities";

const elementName = "workflow-settings-disabled-alert";

@customElement(elementName)
export class WorkflowSettingsDisabledAlert extends UmbElementMixin(LitElement) {
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
    [elementName]: WorkflowSettingsDisabledAlert;
  }
}
