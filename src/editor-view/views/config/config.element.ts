import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-workspace-config";

@customElement(elementName)
export class WorkflowWorkspaceConfigElement extends UmbLitElement {
  render() {
    return html` <workflow-config-content></workflow-config-content>

      <div>
        <workflow-config-display
          approvalType="inherited"
        ></workflow-config-display>

        <workflow-config-display
          approvalType="contentType"
        ></workflow-config-display>

        <workflow-config-content-reviews></workflow-config-content-reviews>
      </div>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
        gap: var(--uui-size-layout-1);
      }

      :host > * {
        flex: 1;
        align-self: baseline;
      }

      workflow-config-display {
        margin-bottom: var(--uui-size-layout-1);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceConfigElement;
  }
}
