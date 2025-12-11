import { UmbTreeServerDataSourceBase } from "@umbraco-cms/backoffice/tree";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { UmbTreeItemModel } from "@umbraco-cms/backoffice/tree";
import {
  WORKFLOW_SETTINGS_ICON,
  WORKFLOW_SETTINGS_ENTITY_TYPE,
  WORKFLOW_SETTINGS_WORKSPACE_PROVIDER,
} from "../constants.js";
import { UmbLocalizationController } from "@umbraco-cms/backoffice/localization-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE } from "./constants.js";
import { ManifestWorkflowSettingsWorkspaceProvider } from "../types.js";

export interface WorkflowSettingsTreeItemResponseModel
  extends UmbTreeItemModel {}

export class WorkflowSettingsTreeDataSource extends UmbTreeServerDataSourceBase<
  WorkflowSettingsTreeItemResponseModel,
  UmbTreeItemModel
> {
  #localize = new UmbLocalizationController(this);

  constructor(host: UmbControllerHost) {
    super(host, {
      getRootItems: () => this.getRootItems(),
      getChildrenOf: () => this.getChildrenOf(),
      getAncestorsOf: () => this.getAncestorsOf(),
      mapper: (item) => item,
    });
  }

  getRootItems() {
    const items = umbExtensionsRegistry.getByType(
      WORKFLOW_SETTINGS_WORKSPACE_PROVIDER
    );

    return Promise.resolve({
      data: {
        items: items.map((x) => this.mapper(x)),
        total: items.length,
        totalBefore: 0,
        totalAfter: 0,
      },
    });
  }

  getChildrenOf = () => this.getRootItems();

  getAncestorsOf = () => {
    throw new Error("Not implemented");
  };

  mapper = (
    item: ManifestWorkflowSettingsWorkspaceProvider
  ): UmbTreeItemModel => {
    return {
      name: this.#localize.term(item.meta.label),
      unique: item.meta.entityType!,
      hasChildren: false,
      parent: {
        unique: null,
        entityType: WORKFLOW_SETTINGS_ROOT_ENTITY_TYPE,
      },
      entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
      icon: WORKFLOW_SETTINGS_ICON,
      isFolder: false,
    };
  };
}
