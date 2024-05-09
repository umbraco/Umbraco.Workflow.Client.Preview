import {
  css,
  customElement,
  html,
  ifDefined,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WorkflowApprovalGroupsDetailRepository } from "../../../section/approval-group/repository/detail/approval-groups-detail.repository.js";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";
import { WORKFLOW_GROUP_PICKER_MODAL } from "@umbraco-workflow/modal";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

const elementName = "workflow-group-filter";

// TODO => this should use the new group picker context
@customElement(elementName)
export class WorkflowGroupFilterElement extends WorkflowBaseFilterElement<
  string | undefined
> {
  #approvalGroupsRepository = new WorkflowApprovalGroupsDetailRepository(this);

  @state()
  group?: UserGroupBaseModel;

  async connectedCallback() {
    super.connectedCallback();

    if (this.value) {
      const { data } = await this.#approvalGroupsRepository.listSlim();
      this.group = data?.items.find((g) => g.unique === this.value);
    }
  }

  async #openGroupPicker() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_GROUP_PICKER_MODAL);

    const { selection } = await modalHandler!.onSubmit();
    if (!selection?.length) return;

    this.setValue(this.group?.unique);
  }

  render() {
    return this.value
      ? html`<uui-ref-list>
            <uui-ref-node-user name=${ifDefined(this.group?.name)}
              ><uui-icon
                slot="icon"
                name=${ifDefined(this.group?.icon ?? undefined)}
              ></uui-icon
            ></uui-ref-node-user> </uui-ref-list
          ><uui-button @click=${() => this.setValue("")} label="Remove"
            >Remove</uui-button
          >`
      : html` <workflow-add-button
          @click=${this.#openGroupPicker}
          .labelKey=${"workflow_addWorkflowGroups"}
        ></workflow-add-button>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
      }

      uui-ref-list {
        flex: 1;
        margin-bottom: var(--uui-size-space-3);
      }

      workflow-add-button {
        flex: 1;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowGroupFilterElement;
  }
}
