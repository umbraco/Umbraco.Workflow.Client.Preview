import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_MYTASKS_COLLECTION_CONTEXT } from "./my-tasks-collection.context-token.js";
import { WorkflowMyTasksCollectionContext } from "./my-tasks-collection.context.js";
import { WorkflowCollectionHeaderBaseElement } from "../../collection/index.js";

const elementName = "workflow-my-tasks-collection-header";

@customElement(elementName)
export class WorkflowMyTasksCollectionHeaderElement extends WorkflowCollectionHeaderBaseElement<WorkflowMyTasksCollectionContext> {
  constructor() {
    super({
      contextToken: WORKFLOW_MYTASKS_COLLECTION_CONTEXT,
      title: "workflow_myTasks",
    });
  }
}

export default WorkflowMyTasksCollectionHeaderElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowMyTasksCollectionHeaderElement;
  }
}
