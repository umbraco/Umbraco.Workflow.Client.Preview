import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_RELEASESET_TASK_EDITOR_MODAL } from "../../../../../modal/index.js";
import { taskProperties } from "../../../task-properties.js";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../../../../workspace/index.js";
import type { ReleaseSetTaskResponseModel } from "@umbraco-workflow/generated";

const elementName = "release-set-task-table-name-column-layout";

@customElement(elementName)
export class ReleaseSetTaskTableNameColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: ReleaseSetTaskResponseModel;

  async #onClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const task = await umbOpenModal(
      this,
      WORKFLOW_RELEASESET_TASK_EDITOR_MODAL,
      {
        data: {
          task: this.value,
          properties: taskProperties.filter((x) => x.edit !== false),
        },
      }
    )
      .then((result) => result.task)
      .catch(() => {});

    if (!task) return;

    const context = await this.getContext(
      WORKFLOW_RELEASESET_WORKSPACE_CONTEXT
    );
    if (!context) {
      throw new Error(
        "Could not find context: WORKFLOW_RELEASESET_WORKSPACE_CONTEXT"
      );
    }

    context.updateTask({ ...this.value, ...task });
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
