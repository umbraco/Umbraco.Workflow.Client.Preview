import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { WorkflowServerDataSource } from "@umbraco-workflow/repository";
import {
  SettingsService,
  type WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";

/**
 * A data source for Settings that fetches data from the server
 * @export
 * @class WorkflowSettingsServerDataSource
 * @implements {WorkflowDetailDataSource}
 */
export class WorkflowSettingsServerDataSource
  implements WorkflowServerDataSource<WorkflowSettingsPropertiesModel>
{
  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    this.#host = host;
  }

  /**
   * Fetches the settings from the server
   * @return {*}
   * @memberof WorkflowSettingsServerDataSource
   */
  async read() {
    return await tryExecute(this.#host, SettingsService.getSettings());
  }

  /**
   * Updates the settings on the server
   * @param {WorkflowSettingsPropertiesModel} settings
   * @return {*}
   * @memberof WorkflowSettingsServerDataSource
   */
  async update(settings: WorkflowSettingsPropertiesModel) {
    return await tryExecute(
      this.#host,
      SettingsService.putSettings({ body: settings })
    );
  }
}
