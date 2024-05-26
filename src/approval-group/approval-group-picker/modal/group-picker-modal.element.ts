import {
  html,
  customElement,
  state,
  ifDefined,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbSelectionManager } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIMenuItemEvent } from "@umbraco-cms/backoffice/external/uui";
import {
  UmbSelectedEvent,
  UmbDeselectedEvent,
} from "@umbraco-cms/backoffice/event";
import {
  WorkflowApprovalGroupCollectionRepository,
  type WorkflowApprovalGroupCollectionModel,
} from "@umbraco-workflow/approval-group";
import type {
  WorkflowGroupPickerModalData,
  WorkflowGroupPickerModalResult,
} from "./group-picker-modal.token.js";

const elementName = "workflow-group-picker-modal-element";

@customElement(elementName)
export class WorkflowGroupPickerModalElement extends UmbModalBaseElement<
  WorkflowGroupPickerModalData,
  WorkflowGroupPickerModalResult
> {
  #selectionManager = new UmbSelectionManager(this);
  #approvalGroupsRepository = new WorkflowApprovalGroupCollectionRepository(
    this
  );

  @state()
  private _groups?: Array<WorkflowApprovalGroupCollectionModel> = [];

  connectedCallback() {
    super.connectedCallback();

    this.#selectionManager.setSelectable(true);
    this.#selectionManager.setMultiple(this.data?.multiple ?? false);
    this.#selectionManager.setSelection(this.value?.selection ?? []);
    this.observe(
      this.#selectionManager.selection,
      (selection) => this.updateValue({ selection }),
      "selectionObserver"
    );
  }

  protected firstUpdated(): void {
    this.#observeUserGroups();
  }

  async #observeUserGroups() {
    const { error, asObservable } =
      await this.#approvalGroupsRepository.requestCollection();
    if (error) return;
    this.observe(
      asObservable(),
      (items) => (this._groups = items),
      "approvalGroupsObserver"
    );
  }

  #onSelected(
    event: UUIMenuItemEvent,
    item: WorkflowApprovalGroupCollectionModel
  ) {
    if (!item.unique) throw new Error("User group unique is required");
    event.stopPropagation();
    this.#selectionManager.select(item.unique);
    this.requestUpdate();
    this.modalContext?.dispatchEvent(new UmbSelectedEvent(item.unique));
  }

  #onDeselected(
    event: UUIMenuItemEvent,
    item: WorkflowApprovalGroupCollectionModel
  ) {
    if (!item.unique) throw new Error("User group unique is required");
    event.stopPropagation();
    this.#selectionManager.deselect(item.unique);
    this.requestUpdate();
    this.modalContext?.dispatchEvent(new UmbDeselectedEvent(item.unique));
  }

  #onSubmit() {
    const selection = this.#selectionManager.getSelection();
    this.updateValue({
      selection,
      selectedItems: this._groups?.filter((g) => selection.includes(g.unique)),
    });
    this._submitModal();
  }

  render() {
    return html`
      <umb-body-layout
        headline=${this.localize.term("workflow_addWorkflowGroups")}
      >
        <uui-box>
          ${this._groups?.map(
            (item) => html`
              <uui-menu-item
                label=${ifDefined(item.name)}
                selectable
                @selected=${(event: UUIMenuItemEvent) =>
                  this.#onSelected(event, item)}
                @deselected=${(event: UUIMenuItemEvent) =>
                  this.#onDeselected(event, item)}
                ?selected=${this.#selectionManager.isSelected(item.unique)}
              >
                <umb-icon
                  .name=${item.icon ? `icon-${item.icon}` : undefined}
                  slot="icon"
                ></umb-icon>
              </uui-menu-item>
            `
          )}
        </uui-box>
        <div slot="actions">
          <uui-button
            label=${this.localize.term("general_close")}
            @click=${this._rejectModal}
          ></uui-button>
          <uui-button
            label=${this.localize.term("general_submit")}
            look="primary"
            color="positive"
            @click=${this.#onSubmit}
          ></uui-button>
        </div>
      </umb-body-layout>
    `;
  }
}

export default WorkflowGroupPickerModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowGroupPickerModalElement;
  }
}
