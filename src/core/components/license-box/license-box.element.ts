import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-license-box";

@customElement(elementName)
export class WorkflowLicenseBoxElement extends UmbLitElement {
  render() {
    return html`<uui-box headline=${this.localize.term("workflow_licensing")}>
      <div id="wrapper">
        <workflow-alert
          key="workflow_buyLicensePrompt"
          icon="icon-box-open"
        ></workflow-alert>
        <uui-button
          href="https://umbraco.com/products/umbraco-workflow"
          target="_blank"
          look="primary"
          color="positive"
          .label=${this.localize.term("workflow_buyLicense")}
        ></uui-button>
      </div>
    </uui-box>`;
  }

  static styles = [
    css`
      #wrapper {
        display: flex;
      }

      workflow-alert {
        margin-right: var(--uui-size-space-5);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowLicenseBoxElement;
  }
}
