import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import type { SettingsSectionType } from "../types.js";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "./settings-workspace.context-token.js";
import { noneSomeAll } from "@umbraco-workflow/core";
import type {
  GeneralSettingsModel,
  NotificationsSettingsModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-settings-editor";

@customElement(elementName)
export class WorkflowSettingsEditorElement extends UmbElementMixin(LitElement) {
  #workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  @state()
  generalSettingsHidden = false;

  @state()
  notificationsSettingsHidden = false;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
      if (!instance) return;

      this.#workspaceContext = instance;
      this.#observeSettingsVisibility();
    });
  }

  /**
   * If all settings on either view are hidden, remove the view from the UI
   */
  #observeSettingsVisibility() {
    const updateViewVisibility = (
      settings: GeneralSettingsModel | NotificationsSettingsModel,
      alias: SettingsSectionType
    ) => {
      if (noneSomeAll(settings).allHidden === false) {
        return;
      }

      if (alias === "generalSettings") {
        this.generalSettingsHidden = true;
      }

      if (alias === "notificationsSettings") {
        this.notificationsSettingsHidden = true;
      }

      umbExtensionsRegistry.unregister(
        `Umb.WorkspaceView.Workflow.Settings.${alias}`
      );

      if (this.generalSettingsHidden && this.notificationsSettingsHidden) {
        umbExtensionsRegistry.unregister(
          "Workflow.WorkspaceAction.Settings.Save"
        );
      }
    };

    this.observe(this.#workspaceContext!.generalSettings, (generalSettings) => {
      if (!generalSettings) return;
      updateViewVisibility(generalSettings, "generalSettings");
    });

    this.observe(
      this.#workspaceContext!.notificationsSettings,
      (notificationsSettings) => {
        if (!notificationsSettings) return;
        updateViewVisibility(notificationsSettings, "notificationsSettings");
      }
    );
  }

  render() {
    return html`<umb-workspace-editor
      alias="Workflow.Workspace.Settings"
      .headline=${this.localize.term("general_settings")}
    >
      ${when(
        this.generalSettingsHidden && this.notificationsSettingsHidden,
        () =>
          html`<div id="alertPadding">
            <workflow-alert key="workflow_allSettingsHidden"></workflow-alert>
          </div>`
      )}
    </umb-workspace-editor>`;
  }

  static styles = [
    css`
      #alertPadding {
        padding: var(--uui-size-space-6);
      }
    `,
  ];
}

export default WorkflowSettingsEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsEditorElement;
  }
}
