import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_DOCUMENT_WORKSPACE_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS } from "../editor-view/conditions/constants.js";

export class WorkflowActionRegistrar extends UmbControllerBase {
  #workspaceActionMap = [
    "Umb.WorkspaceAction.Document.Save",
    "Umb.WorkspaceAction.Document.SaveAndPreview",
    "Umb.WorkspaceAction.Document.SaveAndPublish",
  ];

  #entityActionMap = [
    "Umb.EntityAction.Document.Publish",
    "Umb.EntityAction.Document.Unpublish",
  ];

  hostConnected() {
    super.hostConnected();

    this.#workspaceActionMap.forEach((entity) => {
      umbExtensionsRegistry.appendCondition(entity, {
        alias: WORKFLOW_DOCUMENT_WORKSPACE_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS,
      });
    });

    this.#entityActionMap.forEach((entity) => {
      umbExtensionsRegistry.appendCondition(entity, {
        alias: WORKFLOW_DOCUMENT_WORKSPACE_ENTITY_ACTION_VISIBILITY_CONDITION_ALIAS,
      });
    });
  }
}
