import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowRejectTaskModalData,
  WorkflowRejectTaskModalResult,
} from "../token/index.js";

const elementName = "workflow-reject-task-modal";

@customElement(elementName)
export class WorkflowRejectTaskModalElement extends UmbModalBaseElement<
  WorkflowRejectTaskModalData,
  WorkflowRejectTaskModalResult
> {
  @state()
  assignTo?;

  #handleSubmit() {
    this.value = { assignTo: this.assignTo };
    this.modalContext?.submit();
  }

  #handleSelection(e: UUIInputEvent) {
    e.stopPropagation();
    if (e.target.value) this.assignTo = e.target.value;
  }

  #getStageLabel(groupName: string, idx: number) {
    return `${this.localize.term("workflow_stage")} ${idx + 1}: ${groupName}`;
  }

  render() {
    return html`<umb-body-layout
      headline=${this.localize.term("workflow_assignTo")}
    >
      <div id="main">
        <umb-property-layout
          label=${this.localize.term("workflow_originalEditor")}
        >
          <uui-radio
            slot="editor"
            @change=${this.#handleSelection}
            .value=${"user"}
            label=${this.data?.requestedBy ?? ""}
          ></uui-radio>
        </umb-property-layout>
        <umb-property-layout
          label=${this.localize.term("workflow_previousGroup")}
        >
          <uui-radio-group @change=${this.#handleSelection} slot="editor">
            ${this.data?.groups.map(
              (group, idx) => html` <uui-radio
                .value=${group.groupKey!}
                .label=${this.#getStageLabel(group.groupName!, idx)}
              >
              </uui-radio>`
            )}
          </uui-radio-group>
        </umb-property-layout>
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this.#handleSubmit}
          ?disabled=${!this.assignTo}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      #main {
        max-width: 400px;
      }
    `,
  ];
}

export default WorkflowRejectTaskModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowRejectTaskModalElement;
  }
}
