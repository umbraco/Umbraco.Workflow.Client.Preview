import { UmbMenuTreeStructureWorkspaceContextBase } from "@umbraco-cms/backoffice/menu";

import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { WORKFLOW_SETTINGS_TREE_REPOSITORY_ALIAS } from "../tree/constants";

export class WorkflowSettingsMenuStructureWorkspaceContext extends UmbMenuTreeStructureWorkspaceContextBase {
  constructor(host: UmbControllerHost) {
    super(host, {
      treeRepositoryAlias: WORKFLOW_SETTINGS_TREE_REPOSITORY_ALIAS,
    });
  }
}

export default WorkflowSettingsMenuStructureWorkspaceContext;
