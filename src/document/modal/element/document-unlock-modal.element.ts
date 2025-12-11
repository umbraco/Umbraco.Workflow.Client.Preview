import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import {
  WorkflowDocumentUnlockModalData,
  WorkflowDocumentUnlockModalResult,
} from "../token/index.js";

const elementName = "workflow-document-unlock-modal";

@customElement(elementName)
export class WorkflowDocumentUnlockModalElement extends UmbModalBaseElement<
  WorkflowDocumentUnlockModalData,
  WorkflowDocumentUnlockModalResult
> {
  readonly #propertyAlias = "publish";

  @state()
  private _value: Array<UmbPropertyValueData> = [
    {
      alias: this.#propertyAlias,
      value: true,
    },
  ];

  #onValueChange(e: Event) {
    this._value = (e.target as UmbPropertyDatasetElement).value;
  }

  #submitModal() {
    this.value = {
      publish:
        (this._value.find((x) => x.alias === this.#propertyAlias)
          ?.value as boolean) ?? false,
    };
    this._submitModal();
  }

  render() {
    return html` <uui-dialog-layout .headline=${"Confirm unlock"}
      ><p>${this.localize.term("workflow_confirmUnlockMessage")}</p>
      <umb-property-dataset
        @change=${this.#onValueChange}
        .value=${this._value}
      >
        <umb-property
          alias=${this.#propertyAlias}
          label=${this.localize.term("workflow_publishUnlockedDocument")}
          property-editor-ui-alias="Umb.PropertyEditorUi.Toggle"
        ></umb-property>
      </umb-property-dataset>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this.#submitModal}
        ></uui-button></div
    ></uui-dialog-layout>`;
  }

  static styles = css`
    uui-dialog-layout {
      max-width: 600px;
    }
  `;
}

export default WorkflowDocumentUnlockModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDocumentUnlockModalElement;
  }
}
