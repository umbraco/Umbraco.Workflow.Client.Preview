import {
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowSettingsRepository } from "../repository/settings.repository.js";
import {
  WORKFLOW_CONTENTAPPROVAL_SETTINGS_ENTITY_TYPE,
  WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
} from "../constants.js";
import { WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT } from "./settings-workspace.context-token.js";
import {
  ApprovalThresholdModel,
  GlobalWorkflowVariablesModel,
  type GeneralSettingsModel,
  type NotificationsSettingsModel,
  type SettingsPropertyDisplayModel,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";
import {
  WORKFLOW_CONTEXT,
  WorkflowSettingsWorkspaceContextBase,
} from "@umbraco-workflow/context";

export class WorkflowSettingsWorkspaceContext
  extends WorkflowSettingsWorkspaceContextBase<WorkflowSettingsPropertiesModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  #generalSettings = new UmbObjectState<GeneralSettingsModel | undefined>(
    undefined
  );
  #notificationsSettings = new UmbObjectState<
    NotificationsSettingsModel | undefined
  >(undefined);

  generalSettings = this.#generalSettings.asObservable();
  notificationsSettings = this.#notificationsSettings.asObservable();

  documentTypeApprovalFlows = this.#generalSettings.asObservablePart(
    (x) => x?.documentTypeApprovalFlows
  );
  newNodeApprovalFlow = this.#generalSettings.asObservablePart(
    (x) => x?.newNodeApprovalFlow
  );

  #globalVariables?: GlobalWorkflowVariablesModel;

  constructor(host: UmbControllerHostElement, args: { title: string }) {
    super(host, {
      ...args,
      workspaceAlias: WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_ALIAS,
      entityTypeAlias: WORKFLOW_CONTENTAPPROVAL_SETTINGS_ENTITY_TYPE,
      contextToken: WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT,
      repositoryCtor: WorkflowSettingsRepository,
    });

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this.#globalVariables = context?.getVariables();
    });
  }

  async load() {
    if (!this.repository) return;

    const { data } = await this.repository.read();
    if (data) {
      this.#generalSettings.update(data.generalSettings);
      this.#notificationsSettings.update(data.notificationsSettings);
    }
  }

  getPropertySection(key: keyof WorkflowSettingsPropertiesModel) {
    return key === "generalSettings"
      ? this.#generalSettings
      : this.#notificationsSettings;
  }

  getProperties(key: keyof WorkflowSettingsPropertiesModel) {
    return this.getPropertySection(key)?.getValue()?.properties ?? [];
  }

  setProperties(
    properties: Array<SettingsPropertyDisplayModel>,
    key: keyof WorkflowSettingsPropertiesModel
  ) {
    this.getPropertySection(key)?.update({ properties });
  }

  #getValueOrDefault<ValueType>(
    alias: string,
    globalAlias?: keyof GlobalWorkflowVariablesModel
  ) {
    return (this.getPropertySection("generalSettings")
      .getValue()
      ?.properties.find((x) => x.alias === alias)?.value ??
      this.#globalVariables?.[globalAlias ?? alias]) as ValueType;
  }

  getConfigureApprovalThreshold() {
    return this.#getValueOrDefault<boolean>("configureApprovalThreshold");
  }

  getDefaultApprovalThreshold() {
    return this.#getValueOrDefault<ApprovalThresholdModel>(
      "approvalThreshold",
      "defaultApprovalThreshold"
    );
  }

  setValue<ValueType>(
    value: ValueType,
    alias: keyof GeneralSettingsModel | keyof NotificationsSettingsModel,
    sectionAlias: keyof WorkflowSettingsPropertiesModel
  ) {
    const section = this.getPropertySection(sectionAlias);
    section.update({ [alias]: { ...section.getValue()?.[alias], value } });
  }

  async installEmailTemplates() {
    await (
      this.repository as WorkflowSettingsRepository
    )?.installEmailTemplates();
  }

  async submit() {
    await this.repository?.save({
      generalSettings: this.#generalSettings.getValue()!,
      notificationsSettings: this.#notificationsSettings.getValue()!,
    });
  }
}

export { WorkflowSettingsWorkspaceContext as api };
