import { customElement } from "@umbraco-cms/backoffice/external/lit";
import "./views/table/release-set-task-table-collection-view.element.js";
import { ReleaseSetComponentCollectionElement } from "../release-set-collection-base.element.js";
import {
  WORKFLOW_RELEASESET_TASK_COLLECTION_CONTEXT,
  WorkflowReleaseSetTaskCollectionContext,
} from "./release-set-task-collection.context.js";
import type { ReleaseSetTaskResponseModelReadable } from "@umbraco-workflow/generated";

const elementName = "workflow-release-set-task-collection";

@customElement(elementName)
export class WorkflowReleaseSetTaskCollectionElement extends ReleaseSetComponentCollectionElement<
  ReleaseSetTaskResponseModelReadable,
  WorkflowReleaseSetTaskCollectionContext
> {
  constructor() {
    super(WORKFLOW_RELEASESET_TASK_COLLECTION_CONTEXT, ctx => ctx?.tasks);
  }
}

export default WorkflowReleaseSetTaskCollectionElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetTaskCollectionElement;
  }
}
