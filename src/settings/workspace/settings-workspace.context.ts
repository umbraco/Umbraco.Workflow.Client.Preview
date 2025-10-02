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
import { WORKFLOW_SETTINGS_ENTITY_TYPE, WORKFLOW_SETTINGS_WORKSPACE_ALIAS } from "../constants.js";
import { WorkflowSettingsEditorElement } from "./settings-editor.element.js";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "./settings-workspace.context-token.js";
import {
  ApprovalThresholdModel,
  type GeneralSettingsModel,
  type NotificationsSettingsModel,
  type SettingsPropertyDisplayModel,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

export class WorkflowSettingsWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<WorkflowSettingsPropertiesModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly IS_WORKFLOW_SETTINGS_WORKSPACE_CONTEXT = true;
  private readonly repository = new WorkflowSettingsRepository(this);

  readonly #configureApprovalThreshold = "configureApprovalThreshold";
  readonly #approvalThreshold = "approvalThreshold";

  // only requires a value to ensure save button is enabled
  #unique = new UmbObjectState<string>(WORKFLOW_SETTINGS_ENTITY_TYPE);

  #generalSettings = new UmbObjectState<GeneralSettingsModel | undefined>(
    undefined
  );
  #notificationsSettings = new UmbObjectState<
    NotificationsSettingsModel | undefined
  >(undefined);

  unique = this.#unique.asObservable();
  generalSettings = this.#generalSettings.asObservable();
  notificationsSettings = this.#notificationsSettings.asObservable();

  documentTypeApprovalFlows = this.#generalSettings.asObservablePart(x => x?.documentTypeApprovalFlows);
  newNodeApprovalFlow = this.#generalSettings.asObservablePart(x => x?.newNodeApprovalFlow);

  configureApprovalThreshold = false;
  defaultApprovalThreshold = ApprovalThresholdModel.ONE;

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_SETTINGS_WORKSPACE_ALIAS);
    this.provideContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, this);

    this.routes.setRoutes([
      {
        path: "",
        component: WorkflowSettingsEditorElement,
        setup: () => {
          this.load();
        },
      },
    ]);

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      const globalVariables = context?.getVariables();
      if (!globalVariables) return;

      this.configureApprovalThreshold =
        globalVariables.configureApprovalThreshold;
      this.defaultApprovalThreshold =
        globalVariables.defaultApprovalThreshold;
    });
  }

  async load() {
    const { data } = await this.repository.read();
    if (data) {
      this.#generalSettings.update(data.generalSettings);
      this.#notificationsSettings.update(data.notificationsSettings);
    }
  }

  getData() {
    return undefined;
  }

  getEntityType() {
    return WORKFLOW_SETTINGS_ENTITY_TYPE;
  }

  getUnique() {
    return this.#unique.getValue();
  }

  getConfigureApprovalThreshold() {
    return (
      <boolean>(
        this.#generalSettings
          .getValue()
          ?.properties?.find(
            (x) => x.alias === this.#configureApprovalThreshold
          )?.value
      ) ?? this.configureApprovalThreshold
    );
  }

  getDefaultApprovalThreshold() {
    const prop = this.#generalSettings
      .getValue()
      ?.properties?.find((x) => x.alias === this.#approvalThreshold);

    return (prop?.value ?? this.defaultApprovalThreshold) as ApprovalThresholdModel;
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
    alias: keyof GeneralSettingsModel | keyof NotificationsSettingsModel,
    sectionAlias: keyof WorkflowSettingsPropertiesModel
  ) {
    const section =
      sectionAlias === "generalSettings"
        ? this.#generalSettings
        : this.#notificationsSettings;
    if (!section) return;

    // setPropertyValue looks up by alias
    const property = this.#setPropertyValue(
      [{ ...section.getValue()?.[alias], ...{ alias } }],
      value,
      alias
    )[0];

    section.update({ [alias]: property });
  }

  setPropertyValue(
    value: unknown,
    alias: string,
    sectionAlias: keyof WorkflowSettingsPropertiesModel
  ) {
    const section =
      sectionAlias === "generalSettings"
        ? this.#generalSettings
        : this.#notificationsSettings;
    if (!section) return;

    const properties = this.#setPropertyValue(
      section.getValue()?.properties ?? [],
      value,
      alias
    );

    section.update({ properties });
  }

  async installEmailTemplates() {
    await this.repository.installEmailTemplates();
  }

  async submit() {
    await this.repository.save({
      generalSettings: this.#generalSettings.getValue()!,
      notificationsSettings: this.#notificationsSettings.getValue()!,
    });
  }
}

export { WorkflowSettingsWorkspaceContext as api };
