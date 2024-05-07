import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement, css, html } from "@umbraco-cms/backoffice/external/lit";
import { noneSomeAll } from "@umbraco-workflow/core";
import type {
  ContentReviewsSettingsModel,
  GeneralSettingsModel,
  NotificationsSettingsModel,
} from "@umbraco-workflow/generated";

export class WorkspaceWithSettingsViewBase extends UmbElementMixin(LitElement) {
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

  static styles = [
    css`
      [slot="headline"] {
        display: flex;
        flex-direction: column;
      }

      [slot="headline"] small {
        font-weight: 400;
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
