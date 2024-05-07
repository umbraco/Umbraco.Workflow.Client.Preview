import { html, state } from "@umbraco-cms/backoffice/external/lit";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../settings-workspace.context-token.js";
import { WorkspaceWithSettingsViewBase } from "../../../workspace-with-settings-view-base.element.js";
import type { SettingsSectionType } from "../../types.js";
import type {
  GeneralSettingsModel,
  NotificationsSettingsModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";

export class WorkflowSettingsWorkspaceViewBase extends WorkspaceWithSettingsViewBase {
  workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  @state()
  _generalSettings?: GeneralSettingsModel;

  @state()
  _notificationsSettings?: NotificationsSettingsModel;

  init: Promise<unknown>;

  constructor() {
    super();

    this.init = Promise.all([
      this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
        if (!instance) return;

        this.workspaceContext = instance;

        this.observe(this.workspaceContext.generalSettings, (settings) => {
          this._generalSettings = settings;
        });

        this.observe(
          this.workspaceContext.notificationsSettings,
          (settings) => {
            this._notificationsSettings = settings;
          }
        );
      }).asPromise(),
    ]);
  }

  onDataChange(e: Event, sectionAlias: SettingsSectionType) {
    const newValue = (e.target as UmbPropertyDatasetElement).value;
    (sectionAlias === "generalSettings"
      ? this._generalSettings
      : this._notificationsSettings
    )?.properties.forEach((p) => {
      this.workspaceContext?.setPropertyValue(
        newValue.find((x) => x.alias === p.alias)?.value,
        p.alias,
        sectionAlias
      );
    });
  }

  renderPropertyDataSet(
    alias: SettingsSectionType,
    value?: Array<SettingsPropertyDisplayModel>
  ) {
    return html` <umb-property-dataset
      .value=${value as Array<UmbPropertyValueData>}
      @change=${(e: Event) => this.onDataChange(e, alias)}
    >
      ${value?.map(
        (p) =>
          html`<umb-property
            .label=${this.localize.term(p.label)}
            .description=${this.localize.term(p.description)}
            .config=${p.config}
            alias=${p.alias}
            property-editor-ui-alias=${p.editorUiAlias}
          ></umb-property>`
      )}
    </umb-property-dataset>`;
  }
}

export default WorkflowSettingsWorkspaceViewBase;
