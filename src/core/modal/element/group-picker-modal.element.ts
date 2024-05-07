import {
  css,
  html,
  customElement,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbSelectionManager } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";
import type {
  WorkflowGroupPickerModalData,
  WorkflowGroupPickerModalResult,
} from "@umbraco-workflow/modal";
import { WorkflowApprovalGroupsRepository } from "@umbraco-workflow/approval-group";

const elementName = "workflow-group-picker-modal-element";

@customElement(elementName)
export class WorkflowGroupPickerModalElement extends UmbModalBaseElement<
  WorkflowGroupPickerModalData,
  WorkflowGroupPickerModalResult
> {
  #selectionManager = new UmbSelectionManager(this);
  #approvalGroupsRepository = new WorkflowApprovalGroupsRepository(this);

  @state()
  groups?: Array<UserGroupBaseModel> = [];

  async connectedCallback() {
    super.connectedCallback();

    const { data } = await this.#approvalGroupsRepository.listSlim();
    this.groups = data?.items ?? [];

    if (!this.groups?.length) {
      return;
    }

    this.#selectionManager.setSelectable(true);
    this.#selectionManager.setMultiple(true);
    this.#selectionManager.setSelection(this.data?.selection ?? []);
  }

  #handleSubmit() {
    const selection = this.#selectionManager.getSelection();
    this.value = {
      groups: this.groups?.filter((x) => selection.includes(x.key!)) ?? null,
    };
    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
  }

  render() {
    return html`<umb-body-layout headline="Group picker">
      <div id="main">
        <uui-box>
          ${when(
            this.groups?.length,
            () =>
              this.groups?.map(
                (group) => html`
                  <uui-menu-item
                    .label=${group.name}
                    selectable
                    @selected=${() => this.#selectionManager.select(group.key!)}
                    @deselected=${() =>
                      this.#selectionManager.deselect(group.key!)}
                    ?selected=${this.#selectionManager.isSelected(group.key!)}
                  >
                    <uui-avatar slot="icon" .name=${group.name!}></uui-avatar>
                  </uui-menu-item>
                `
              ),
            () => this.localize.term("content_noItemsToShow")
          )}
        </uui-box>
      </div>
      <div slot="actions">
        <uui-button
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
        ${when(
          this.groups?.length,
          () => html` <uui-button
            id="submit"
            color="positive"
            look="primary"
            label="Submit"
            @click=${this.#handleSubmit}
          ></uui-button>`
        )}
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

export default WorkflowGroupPickerModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowGroupPickerModalElement;
  }
}
