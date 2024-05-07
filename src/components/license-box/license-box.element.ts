import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import type { WorkflowLicenseModel } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-license-box";

@customElement(elementName)
export class WorkflowLicenseBoxElement extends UmbElementMixin(LitElement) {
  @state()
  license?: WorkflowLicenseModel;

  @state()
  hasSettingsAccess = false;

  currentUserContext?: typeof UMB_CURRENT_USER_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (instance) => {
      if (!instance) return;
      this.currentUserContext = instance;
      this.#observeCurrentUser();
    });

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;

      this.observe(instance.license, (license) => {
        if (!license) return;
        this.license = license;
      });
    });
  }

  #observeCurrentUser() {
    if (!this.currentUserContext) return;

    this.observe(this.currentUserContext.currentUser, (user) => {
      // TODO => permissions for settings section?
      this.hasSettingsAccess = user?.permissions.length === 0 ?? false;
    });
  }

  #renderUnlicensed() {
    return html` <div id="wrapper">
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
    </div>`;
  }

  #renderLicensed() {
    return html`<p>
      <umb-localize key="workflow_licenseInSettings"
        >License details have moved to a
        <a
          href=${this.hasSettingsAccess ? "#/settings?dashboard=licenses" : "#"}
          >separate dashboard in the settings section</a
        >.</umb-localize
      >
    </p>`;
  }

  #isUnlicensed() {
    return (
      this.license?.isTrial ||
      (this.license?.isImpersonating && !this.license.isLicensed)
    );
  }

  render() {
    return html`<uui-box headline=${this.localize.term("workflow_licensing")}>
      ${when(
        this.#isUnlicensed(),
        () => this.#renderUnlicensed(),
        () => this.#renderLicensed()
      )}
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
