import { css, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbSelectionManager } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  WorkflowItemPickerModalData,
  WorkflowItemPickerModalResult,
} from "./item-picker-modal.token.js";

const elementName = "workflow-item-picker-modal";

@customElement(elementName)
export class WorkflowItemPickerModalElement extends UmbModalBaseElement<
  WorkflowItemPickerModalData,
  WorkflowItemPickerModalResult
> {
  #selectionManager = new UmbSelectionManager(this);

  async connectedCallback() {
    super.connectedCallback();

    this.#selectionManager.setSelectable(true);
    this.#selectionManager.setMultiple(this.data?.multiple ?? false);
    this.#selectionManager.setSelection(
      this.data?.items.filter((x) => x.selected).map((x) => x.key ?? null) ?? []
    );
  }

  #handleSubmit() {
    this.value = { selection: this.#selectionManager.getSelection() };
    this._submitModal();
  }

  render() {
    return html`<umb-body-layout headline="Item picker">
      <div id="main">
        <uui-box>
          ${this.data?.items.map(
            (item) => html`
              <uui-menu-item
                selectable
                @selected=${() => this.#selectionManager.select(item.key!)}
                @deselected=${() => this.#selectionManager.deselect(item.key!)}
                ?selected=${this.#selectionManager.isSelected(item.key!)}
              >
                <umb-icon slot="icon" .name=${item.icon!}></umb-icon>
                <span slot="label" style="padding:9px 0"
                  >${item.name} <small style="display:block">${item.alias}</small></span
                >
              </uui-menu-item>
            `
          )}
        </uui-box>
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click="${this._rejectModal}"
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      uui-scroll-container {
        overflow-y: scroll;
        max-height: 100%;
        min-height: 0;
        flex: 1;
      }
    `,
  ];
}

export default WorkflowItemPickerModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowItemPickerModalElement;
  }
}
