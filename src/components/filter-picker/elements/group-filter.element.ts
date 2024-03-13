import {
  css,
  customElement,
  html,
  ifDefined,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WorkflowApprovalGroupsRepository } from "../../../section/approval-group/repository/approval-groups.repository.js";
import { WorkflowBaseFilterElement } from "./base-filter.element.js";
import { WORKFLOW_GROUP_PICKER_MODAL } from "@umbraco-workflow/modal";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

const elementName = "workflow-group-filter";

@customElement(elementName)
export class WorkflowGroupFilterElement extends WorkflowBaseFilterElement<
  string | undefined
> {
  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;
  #approvalGroupsRepository = new WorkflowApprovalGroupsRepository(this);

  @state()
  group?: UserGroupBaseModel;

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      if (!instance) return;
      this.#modalManagerContext = instance;
    });
  }

  async connectedCallback() {
    super.connectedCallback();

    if (this.value) {
      const { data } = await this.#approvalGroupsRepository.listSlim();
      this.group = data?.items.find((g) => g.key === this.value);
    }
  }

  async #openGroupPicker() {
    const modalHandler = this.#modalManagerContext?.open(
      this,
      WORKFLOW_GROUP_PICKER_MODAL
    );

    const { groups } = await modalHandler!.onSubmit();
    if (!groups?.length) return;

    this.group = groups.at(0);
    this.setValue(this.group?.key);
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
