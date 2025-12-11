import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_MYSUBMISSIONS_COLLECTION_CONTEXT } from "./my-submissions-collection.context-token.js";
import { WorkflowMySubmissionsCollectionContext } from "./my-submissions-collection.context.js";
import { WorkflowCollectionHeaderBaseElement } from "@umbraco-workflow/core";

const elementName = "workflow-my-submissions-collection-header";

@customElement(elementName)
export class WorkflowMySubmissionsCollectionHeaderElement extends WorkflowCollectionHeaderBaseElement<WorkflowMySubmissionsCollectionContext> {
  constructor() {
    super({
      contextToken: WORKFLOW_MYSUBMISSIONS_COLLECTION_CONTEXT,
      title: "workflow_mySubmissions",
    });
  }
}

export default WorkflowMySubmissionsCollectionHeaderElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowMySubmissionsCollectionHeaderElement;
  }
}
