import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_RELEASESET_TASK_EDITOR_MODAL } from "../../../../../modal/index.js";
import { taskProperties } from "../../../../../task-properties.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../../../workspace/release-set-workspace.context-token.js";
import type { ReleaseSetTaskResponseModelReadable } from "@umbraco-workflow/generated";

const elementName = "release-set-task-table-name-column-layout";

@customElement(elementName)
export class ReleaseSetTaskTableNameColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: ReleaseSetTaskResponseModelReadable;

  async #onClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) {
      throw new Error("Could not find context: UMB_MODAL_MANAGER_CONTEXT");
    }
    const modalHandler = modalContext.open(
      this,
      WORKFLOW_RELEASESET_TASK_EDITOR_MODAL,
      {
        data: {
          task: this.value,
          properties: taskProperties.filter((x) => x.edit !== false),
        },
      }
    );

    await modalHandler.onSubmit().catch(() => {});
    const value = modalHandler.getValue();
    if (!value) return;

    const context = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );
    if (!context) {
      throw new Error("Could not find context: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT");
    }
    
    context.updateTask({ ...this.value, ...value.task });
  }

  render() {
    if (!this.value) return nothing;

    return html`<uui-button compact @click=${this.#onClick}
      >${this.value.name ?? ""}</uui-button
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ReleaseSetTaskTableNameColumnLayoutElement;
  }
}
