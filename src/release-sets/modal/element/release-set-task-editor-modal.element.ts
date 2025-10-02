import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  UmbPropertyValueData,
  UmbPropertyDatasetElement,
} from "@umbraco-cms/backoffice/property";
import type {
  WorkflowReleaseSetTaskEditorModalData,
  WorkflowReleaseSetTaskEditorModalResult,
} from "../token/index.js";
import { type ReleaseSetTaskResponseModelReadable } from "@umbraco-workflow/generated";
import { EMPTY_GUID } from "@umbraco-workflow/core";

const elementName = "workflow-releaseset-task-editor-modal";

@customElement(elementName)
export class WorkflowReleaseSetTaskCreateModalElement extends UmbModalBaseElement<
  WorkflowReleaseSetTaskEditorModalData,
  WorkflowReleaseSetTaskEditorModalResult
> {
  @state()
  propertyValues: Array<UmbPropertyValueData> = [];

  @state()
  private _headline = "";

  connectedCallback(): void {
    super.connectedCallback();

    // no task => create
    this._headline = this.localize.term(
      "workflow_releaseSets_taskEditorHeadline",
      this.data?.task === undefined
    );
    if (!this.data?.task) return;

    this.propertyValues = Object.keys(this.data.task)
      .filter((x) => this.data?.properties.some((p) => p.alias === x))
      .map((x) => {
        let value = this.data?.task?.[x];

        if (x === "assignedTo") {
          value = value["unique"] === EMPTY_GUID ? undefined : value["unique"];
        }

        return {
          alias: x,
          value,
        };
      });
  }

  #flattenByAlias(
    arr: Array<UmbPropertyValueData>
  ): Partial<ReleaseSetTaskResponseModelReadable>  {
    return arr.reduce((result, item) => {
      if (item.alias && item.value) {
        // not flat - object has unique and name props
        if (item.alias === "assignedTo") {
          result[item.alias] = {
            unique: item.value,
          };
        } else {
          result[item.alias] = item.value;
        }
      }
      return result;
    }, {});
  }

  #onValueChange(e: Event) {
    this.propertyValues = (e.target as UmbPropertyDatasetElement).value;
  }

  #onSubmit() {
    const task = this.#flattenByAlias(this.propertyValues);
    this.updateValue({ task });
    this._submitModal();
  }

  render() {
    return html`<umb-body-layout headline=${this._headline}>
      <div id="main">
        <uui-box>
          <umb-property-dataset
            .value=${this.propertyValues}
            @change=${this.#onValueChange}
          >
            ${this.data?.properties.map(
              (prop) =>
                html`<umb-property
                  alias=${prop.alias!}
                  label=${prop.name!}
                  property-editor-ui-alias=${prop.propertyEditorUiAlias!}
                  .config=${prop.config}
                ></umb-property>`
            )}
          </umb-property-dataset>
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
          @click=${this.#onSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }
}

export default WorkflowReleaseSetTaskCreateModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetTaskCreateModalElement;
  }
}
