import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  html,
  nothing,
  customElement,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import {
  WorkflowStatusModel,
  type WorkflowInstanceTableResponseModel,
} from "@umbraco-workflow/generated";
import {
  WORKFLOW_DETAIL_MODAL,
  WORKFLOW_DETAIL_READONLY_MODAL,
} from "@umbraco-workflow/core";

const elementName = "workflow-instances-table-detail-column-layout";

@customElement(elementName)
export class WorkflowInstancesTableDetailColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: WorkflowInstanceTableResponseModel;

  #activeStatus: Array<WorkflowStatusModel> = [
    "PendingApproval",
    "Rejected",
    "Resubmitted",
  ];

  async #detail() {
    const readonly =
      !this.value.status || !this.#activeStatus.includes(this.value.status);

    if (!readonly) {
      umbOpenModal(this, WORKFLOW_DETAIL_MODAL, {
        data: {
          document: {
            name: this.value.document?.name ?? "",
            unique: this.value.document?.unique,
          },
          entityType: this.value.entityType,
          entityKey: this.value.entityKey,
          instanceUnique: this.value.unique,
          action: this.value.action,
          culture: this.value.culture ?? undefined,
          isDashboard: true,
        },
      }).catch(() => {});

      return;
    }

    umbOpenModal(this, WORKFLOW_DETAIL_READONLY_MODAL, {
      data: {
        unique: this.value.unique,
      },
    }).catch(() => {});
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
    [elementName]: WorkflowInstancesTableDetailColumnLayoutElement;
  }
}
