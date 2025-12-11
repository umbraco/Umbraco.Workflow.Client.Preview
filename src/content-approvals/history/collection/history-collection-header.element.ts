import { customElement } from "@umbraco-cms/backoffice/external/lit";
import { InstanceFilters } from "@umbraco-workflow/components";
import { WORKFLOW_HISTORY_COLLECTION_CONTEXT } from "./history-collection.context-token.js";
import { WorkflowHistoryCollectionContext } from "./history-collection.context.js";
import { WorkflowCollectionHeaderBaseElement } from "../../collection/index.js";

const elementName = "workflow-history-collection-header";

@customElement(elementName)
export class WorkflowHistoryCollectionHeaderElement extends WorkflowCollectionHeaderBaseElement<WorkflowHistoryCollectionContext> {
  constructor() {
    super({
      filter: new InstanceFilters({ historyOnly: true }),
      contextToken: WORKFLOW_HISTORY_COLLECTION_CONTEXT,
      onFilterChange: (filters) =>
        this.collectionContext?.setFilter({ filters }),
    });
  }
}

export default WorkflowHistoryCollectionHeaderElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryCollectionHeaderElement;
  }
}
