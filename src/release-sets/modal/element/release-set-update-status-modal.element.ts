import {
  customElement,
  html,
  repeat,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {
  UUIRadioElement,
  type UUIRadioEvent,
} from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowReleaseSetUpdateStatusModalData,
  WorkflowReleaseSetUpdateStatusModalResult,
} from "../token/index.js";
import type { StatusModel } from "@umbraco-workflow/core";

type UmbRadioButtonItem = { label: string; value: string };

const elementName = "workflow-releaseset-updatestatus-modal";

@customElement(elementName)
export class WorkflowReleaseSetUpdateStatusModalElement extends UmbModalBaseElement<
  WorkflowReleaseSetUpdateStatusModalData,
  WorkflowReleaseSetUpdateStatusModalResult
> {
  @state()
  items: Array<UmbRadioButtonItem> = [];

  connectedCallback() {
    super.connectedCallback();
    this.items = Object.values(this.data?.optionType ?? {}).map((x) => ({
      value: x,
      label: this.localize.term(`workflow_releaseSets_${x.toLowerCase()}`),
    }));
  }

  #onValueChange(event: UUIRadioEvent) {
    event.stopPropagation();
    if (!(event.target instanceof UUIRadioElement)) return;
    this.updateValue({
      status: event.target.value as StatusModel,
    });
  }

  #renderRadioButton(item: (typeof this.items)[0]) {
    return html`<uui-radio
      value=${item.value}
      label=${item.label}
    ></uui-radio>`;
  }

  render() {
    return html`<uui-dialog-layout headline=${this.localize.term("workflow_releaseSets_updateStatus")}>
      <div id="main">
        <uui-box>
          <uui-radio-group @change=${this.#onValueChange}>
            ${repeat(
              this.items,
              (item) => item,
              (item) => this.#renderRadioButton(item)
            )}
          </uui-radio-group>
        </uui-box>
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
          ?disabled=${!this.value.status}
          @click=${this._submitModal}
        ></uui-button>
      </div>
    </uui-dialog-layout>`;
  }
}

export default WorkflowReleaseSetUpdateStatusModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetUpdateStatusModalElement;
  }
}
