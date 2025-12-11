import {
  UmbTreeItemModel,
  UmbTreeRepositoryBase,
  UmbTreeRootModel,
} from "@umbraco-cms/backoffice/tree";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { WORKFLOW_ICON } from "@umbraco-workflow/core";
import { WorkflowSettingsTreeDataSource } from "./settings-tree.data-source.js";
import { WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE } from "./constants.js";

export class WorkflowSettingsTreeRepository
  extends UmbTreeRepositoryBase<UmbTreeItemModel, UmbTreeRootModel>
  implements UmbApi
{
  #localize = new UmbLocalizationController(this);

  constructor(host: UmbControllerHost) {
    super(host, WorkflowSettingsTreeDataSource);
  }

  async requestTreeRoot() {
    const { data: treeRootData } = await this._treeSource.getRootItems({
      skip: 0,
      take: 0,
    });
    const hasChildren = treeRootData ? treeRootData.total > 0 : false;

    const data: UmbTreeRootModel = {
      unique: null,
      entityType: WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE,
      name: this.#localize.term("workflow_workflow"),
      hasChildren,
      isFolder: true,
      icon: WORKFLOW_ICON,
    };

    return { data };
  }
}

export { WorkflowSettingsTreeRepository as api };
