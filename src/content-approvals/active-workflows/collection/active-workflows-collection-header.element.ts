import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { InstanceFilters } from "@umbraco-workflow/components";
import { WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_CONTEXT } from "./active-workflows-collection.context-token.js";
import { WorkflowCollectionHeaderBaseElement } from "../../collection/index.js";
import { WorkflowActiveWorkflowsCollectionContext } from "./active-workflows-collection.context.js";

const elementName = "workflow-active-workflows-collection-header";

@customElement(elementName)
export class WorkflowActiveWorkflowsCollectionHeaderElement extends WorkflowCollectionHeaderBaseElement<WorkflowActiveWorkflowsCollectionContext> {
  constructor() {
    super({
      filter: new InstanceFilters(undefined, ["status", "completedDate"]),
      contextToken: WORKFLOW_ACTIVEWORKFLOWS_COLLECTION_CONTEXT,
      onFilterChange: (filters) =>
        this.collectionContext?.setFilter({ filters }),
    });
  }
}

export default WorkflowActiveWorkflowsCollectionHeaderElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowActiveWorkflowsCollectionHeaderElement;
  }
}
