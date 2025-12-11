import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbSubmittableWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../constants.js";
import { WORKFLOW_SETTINGS_WORKSPACE_ALIAS } from "./constants.js";
import { UmbStringState } from "@umbraco-cms/backoffice/observable-api";

export class WorkflowSettingsWorkspaceContext extends UmbSubmittableWorkspaceContextBase<{
  unique: string;
}> {
  #unique = new UmbStringState(undefined);
  unique = this.#unique.asObservable();

  getUnique() {
    return this.#unique.getValue();
  }
  getEntityType() {
    return WORKFLOW_SETTINGS_ENTITY_TYPE;
  }
  getData() {
    return undefined;
  }

  protected submit() {
    return Promise.resolve();
  }

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_SETTINGS_WORKSPACE_ALIAS);
    this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: () => import("./settings-workspace.element.js"),
        setup: (_component, info) => {
          this.#unique.setValue(info.match.params.unique);
        },
      },
    ]);
  }
}

export { WorkflowSettingsWorkspaceContext as api };
