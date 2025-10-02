import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbCollectionConfiguration } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS } from "./constants.js";
import { WorkflowReleaseSetTaskCollectionContext } from "./release-set-task-collection.context.js";

const elementName = "workflow-release-set-tasks";

@customElement(elementName)
export class WorkflowReleaseSetTasksElement extends UmbLitElement {
  #collectionConfig: UmbCollectionConfiguration = {
    pageSize: 10,
  };

  constructor() {
    super();
    new WorkflowReleaseSetTaskCollectionContext(this);
  }

  render() {
    return html`<umb-collection
      alias=${WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS}
      .config=${this.#collectionConfig}
    ></umb-collection>`;
  }
}

export default WorkflowReleaseSetTasksElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetTasksElement;
  }
}
