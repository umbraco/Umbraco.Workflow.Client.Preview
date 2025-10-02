import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  html,
  nothing,
  customElement,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import type { TableColumnLayout } from "../table-column-layout.interface.js";
import {
  WorkflowStatusModel,
  type WorkflowInstanceTableResponseModel,
} from "@umbraco-workflow/generated";
import {
  WORKFLOW_DETAIL_MODAL,
  WORKFLOW_DETAIL_READONLY_MODAL,
} from "@umbraco-workflow/editor-view";

const elementName = "instances-table-detail-column-layout";

@customElement(elementName)
export class InstancesTableDetailColumnLayoutElement
  extends UmbLitElement
  implements TableColumnLayout<WorkflowInstanceTableResponseModel>
{
  @property({ attribute: false })
  value!: WorkflowInstanceTableResponseModel;

  #activeStatus = [
    WorkflowStatusModel.PENDING_APPROVAL,
    WorkflowStatusModel.REJECTED,
    WorkflowStatusModel.RESUBMITTED,
  ];

  async #detail() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalContext) return;

    const readonly =
      !this.value.status ||
      !this.#activeStatus.includes(this.value.status as WorkflowStatusModel);

    if (!readonly) {
      modalContext.open(this, WORKFLOW_DETAIL_MODAL, {
        data: {
          document: {
            name: this.value.document?.name ?? "",
            unique: this.value.document?.unique,
          },
          entityType: this.value.entityType,
          entityKey: this.value.entityKey,
          instanceUnique: this.value.unique,
          action: this.value.action,
          variant: this.value.culture ?? undefined,
          isDashboard: true,
        },
      });

      return;
    }

    modalContext.open(this, WORKFLOW_DETAIL_READONLY_MODAL, {
      data: {
        unique: this.value.unique,
        isDashboard: true,
        entityType: this.value.entityType,
      },
    });
  }

  render() {
    if (!this.value) return nothing;

    return html`<uui-button
      label=${this.localize.term("workflow_detail")}
      look="secondary"
      @click=${this.#detail}
    ></uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: InstancesTableDetailColumnLayoutElement;
  }
}
