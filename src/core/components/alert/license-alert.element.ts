import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
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
export class WorkflowLicenseAlertElement extends UmbLitElement {
  @state()
  license?: WorkflowLicenseModel;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this.license = context?.getLicense() ?? undefined;
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
