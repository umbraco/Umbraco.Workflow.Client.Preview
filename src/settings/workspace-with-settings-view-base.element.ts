import { css, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  WORKFLOW_CONTEXT,
  PropertyModifierStyles,
  getAttributes,
  noneSomeAll,
} from "@umbraco-workflow/core";
import type {
  ContentReviewsSettingsModel,
  GeneralSettingsModel,
  NotificationsSettingsModel,
} from "@umbraco-workflow/generated";

export abstract class WorkspaceWithSettingsViewBaseElement extends UmbLitElement {
  @state()
  private _isTrial?: boolean;

  connectedCallback() {
    super.connectedCallback();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this._isTrial = context?.getLicense()?.isTrial ?? true;

      if (this._isTrial) {
        document.body.style.setProperty(
          "--workflowUnlicensed",
          `'${this.localize.term("workflow_licensedFeature")}'`
        );
      }
    });
  }

  renderNoneSomeAllBanner(
    settings?:
      | GeneralSettingsModel
      | NotificationsSettingsModel
      | ContentReviewsSettingsModel
  ) {
    if (!settings) return;

    const statuses = noneSomeAll(settings);
    if (Object.values(statuses).every((x) => x === false)) {
      return;
    }

    return html`<workflow-settings-disabled-alert
      .statuses=${statuses}
    ></workflow-settings-disabled-alert>`;
  }

  getAttributes(arg: {
    hidden: boolean;
    readonly: boolean;
    requiresLicense: boolean;
  }) {
    return getAttributes(arg, this._isTrial);
  }

  static styles = [
    PropertyModifierStyles,
    css`
      [slot="headline"] {
        display: flex;
        flex-direction: column;
      }

      [slot="headline"] small {
        font-weight: 400;
        line-height: 1.4;
      }

      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }

      #flexyboi {
        display: flex;
        gap: var(--uui-size-space-6);
      }

      #flexyboi > uui-box {
        flex: 1 1 auto;
      }

      #sidebar {
        flex: 0 0 500px;
      }

      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }
    `,
  ];
}
