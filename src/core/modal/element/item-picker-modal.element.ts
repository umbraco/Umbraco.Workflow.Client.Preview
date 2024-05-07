import { css, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbSelectionManager } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  WorkflowItemPickerModalData,
  WorkflowItemPickerModalResult,
} from "../index.js";

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
      this.data?.items.filter((x) => x.selected).map((x) => x.key) ?? []
    );
  }

  #handleSubmit() {
    const selection = this.#selectionManager.getSelection();

    const items =
      this.data?.items.map((item) => ({
        ...item,
        ...{ selected: selection.includes(item.key) },
      })) ?? [];

    this.value = { items };
    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
  }

  render() {
    return html`<umb-body-layout headline="Item picker">
      <div id="main">
        <uui-box>
          ${this.data?.items.map(
            (item) => html`
              <uui-menu-item
                .label=${item.name}
                selectable
                @selected=${() => this.#selectionManager.select(item.key!)}
                @deselected=${() => this.#selectionManager.deselect(item.key!)}
                ?selected=${this.#selectionManager.isSelected(item.key!)}
              >
                <uui-icon slot="icon" .name=${item.icon!}></uui-icon>
              </uui-menu-item>
            `
          )}
        </uui-box>
      </div>
      <div slot="actions">
        <uui-button
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
        <uui-button
          id="submit"
          color="positive"
          look="primary"
          label="Submit"
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
