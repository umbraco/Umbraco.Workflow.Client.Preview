import {
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT } from "./settings-workspace.context-token.js";
import {
  ReleaseSetsSettingsModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";
import {
  WORKFLOW_RELEASESET_SETTINGS_ENTITY_TYPE,
  WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_ALIAS,
} from "../../constants.js";
import { WorkflowReleaseSetSettingsRepository } from "../repository/settings.repository.js";
import { WorkflowSettingsWorkspaceContextBase } from "@umbraco-workflow/context";

export class WorkflowReleaseSetSettingsWorkspaceContext
  extends WorkflowSettingsWorkspaceContextBase<ReleaseSetsSettingsModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  #data = new UmbObjectState<ReleaseSetsSettingsModel | undefined>(undefined);
  data = this.#data.asObservable();

  constructor(host: UmbControllerHostElement, args: { title: string }) {
    super(host, {
      ...args,
      workspaceAlias: WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_ALIAS,
      entityTypeAlias: WORKFLOW_RELEASESET_SETTINGS_ENTITY_TYPE,
      contextToken: WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT,
      repositoryCtor: WorkflowReleaseSetSettingsRepository,
    });
  }

  async load() {
    if (!this.repository) return;

    const { data } = await this.repository.read();
    if (data) {
      this.#data.setValue(data);
    }
  }

  getProperties(): Array<SettingsPropertyDisplayModel> {
    return this.#data.getValue()?.properties ?? [];
  }

  setProperties(properties?: Array<SettingsPropertyDisplayModel>) {
    this.#data.update({ properties });
  }

  async submit() {
    await this.repository?.save(this.#data.getValue());
  }
}

export { WorkflowReleaseSetSettingsWorkspaceContext as api };
