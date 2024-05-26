import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import type { WorkflowLicenseModel } from "@umbraco-workflow/generated";

const elementName = "workflow-license-alert";

@customElement(elementName)
export class WorkflowLicenseAlertElement extends UmbElementMixin(LitElement) {
  #workflowContext?: typeof WORKFLOW_CONTEXT.TYPE;

  @state()
  license?: WorkflowLicenseModel;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      this.#workflowContext = instance;

      this.observe(this.#workflowContext.license, (license) => {
        if (!license) return;
        this.license = license;
      });
    });
  }

  render() {
    return html`${when(
      this.license?.isImpersonating && !this.license.isLicensed,
      () => html`<workflow-alert
        .key=${"workflow_licenseImpersonationActive"}
      ></workflow-alert>`
    )}`;
  }

  static styles = [
    css`
      workflow-alert {
        display: block;
        margin-bottom: var(--uui-size-space-6);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowLicenseAlertElement;
  }
}
