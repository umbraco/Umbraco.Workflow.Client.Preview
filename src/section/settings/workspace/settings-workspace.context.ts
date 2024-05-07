import {
  UmbSubmittableWorkspaceContextBase,
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import {
  UmbObjectState,
  appendToFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowSettingsRepository } from "../repository/settings.repository.js";
import type { SettingsAliasType, SettingsSectionType } from "../types.js";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../index.js";
import { WorkflowSettingsEditorElement } from "./settings-editor.element.js";
import {
  type GeneralSettingsModel,
  type NotificationsSettingsModel,
  type SettingsPropertyDisplayModel,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";

export class WorkflowSettingsWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<WorkflowSettingsPropertiesModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly IS_WORKFLOW_SETTINGS_WORKSPACE_CONTEXT = true;
  private readonly repository = new WorkflowSettingsRepository(this);

  readonly unique;

  #data = new UmbObjectState<WorkflowSettingsPropertiesModel | undefined>(
    undefined
  );
  #generalSettings = new UmbObjectState<GeneralSettingsModel | undefined>(
    undefined
  );
  #notificationsSettings = new UmbObjectState<
    NotificationsSettingsModel | undefined
  >(undefined);

  generalSettings = this.#generalSettings.asObservable();
  notificationsSettings = this.#notificationsSettings.asObservable();

  // TODO: this is a temp solution to bubble validation errors to the UI
  #validationErrors = new UmbObjectState<unknown | undefined>(undefined);
  validationErrors = this.#validationErrors.asObservable();

  constructor(host: UmbControllerHostElement) {
    super(host, "Workflow.Workspace.Settings");

    this.routes.setRoutes([
      {
        path: "",
        component: WorkflowSettingsEditorElement,
        setup: () => {
          this.load();
        },
      },
    ]);
  }

  async load() {
    const { data } = await this.repository.read();
    if (data) {
      this.#data.update(data);
      this.#generalSettings.update(data.generalSettings);
      this.#notificationsSettings.update(data.notificationsSettings);
    }
  }

  getData() {
    return this.#data.getValue();
  }

  getEntityType() {
    return WORKFLOW_SETTINGS_ENTITY_TYPE;
  }

  getEntityId() {
    return "";
  }

  getUnique() {
    return "";
  }

  set(value: Record<string, unknown>) {
    this.#data.update(value);
  }

  #setPropertyValue(
    properties: SettingsPropertyDisplayModel[],
    value: unknown,
    alias: string
  ) {
    const property = {
      ...properties.find((p) => p.alias === alias),
      ...{ value },
    } as SettingsPropertyDisplayModel;

    const newProperties = appendToFrozenArray(
      properties,
      property,
      (x) => x.alias
    );

    return newProperties;
  }

  setValue(
    value: unknown,
    alias: SettingsAliasType,
    sectionAlias: SettingsSectionType
  ) {
    const property = this.#setPropertyValue(
      [this.getData()?.[sectionAlias]![alias]],
      value,
      alias
    )[0];

    const newValue = { [alias]: property };

    if (sectionAlias === "generalSettings") {
      this.#generalSettings.update(newValue);
      this.#data.update({ generalSettings: this.#generalSettings.getValue() });
    } else {
      this.#notificationsSettings.update(newValue);
      this.#data.update({
        notificationsSettings: this.#notificationsSettings.getValue(),
      });
    }
  }

  setPropertyValue(
    value: unknown,
    alias: string,
    sectionAlias: SettingsSectionType
  ) {
    const properties = this.#setPropertyValue(
      this.getData()?.[sectionAlias]?.properties ?? [],
      value,
      alias
    );

    if (sectionAlias === "generalSettings") {
      this.#generalSettings.update({ properties });
      this.#data.update({ generalSettings: this.#generalSettings.getValue() });
    } else {
      this.#notificationsSettings.update({ properties });
      this.#data.update({
        notificationsSettings: this.#notificationsSettings.getValue(),
      });
    }
  }

  async installEmailTemplates() {
    await this.repository.installEmailTemplates();
  }

  async submit() {
    const data = this.getData();
    if (!data) return;
    await this.repository.save(data);
  }

  destroy(): void {
    super.destroy();
  }
}

export { WorkflowSettingsWorkspaceContext as api };
