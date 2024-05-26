import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
} from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-license-box";

@customElement(elementName)
export class WorkflowLicenseBoxElement extends UmbElementMixin(LitElement) {
  connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;

      this.observe(instance.license, (license) => {
        if (!license) return;

        if (license.isLicensed) {
          this.style.display = "none";
        }
      });
    });
  }

  render() {
    return html`<uui-box headline=${this.localize.term("workflow_licensing")}>
      <div id="wrapper">
        <workflow-alert
          key="workflow_buyLicensePrompt"
          icon="license"
        ></workflow-alert>
        <uui-button
          href="https://umbraco.com/products/umbraco-workflow"
          target="_blank"
          look="primary"
          label="buy a license"
        >
          <umb-localize key="workflow_buyLicense">Buy a license</umb-localize>
        </uui-button>
      </div>
    </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: block;
      }

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
