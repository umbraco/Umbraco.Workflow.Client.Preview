import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  html,
  nothing,
  customElement,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import {
  WORKFLOW_DETAIL_MODAL,
  WORKFLOW_DETAIL_READONLY_MODAL,
} from "@umbraco-workflow/editor-view";
import type { WorkflowInstanceResponseModel } from "@umbraco-workflow/generated";
import { WorkflowStatusModel } from "@umbraco-workflow/generated";

const elementName = "base-table-detail-column-layout";

@customElement(elementName)
export class BaseTableDetailColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: WorkflowInstanceResponseModel;

  #activeStatus = [
    WorkflowStatusModel.PENDING_APPROVAL,
    WorkflowStatusModel.REJECTED,
    WorkflowStatusModel.RESUBMITTED,
  ];

  async #detail() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);

    const readonly =
      !this.value.instance?.status ||
      !this.#activeStatus.includes(
        this.value.instance?.status as WorkflowStatusModel
      );

    modalContext.open(
      this,
      readonly ? WORKFLOW_DETAIL_READONLY_MODAL : WORKFLOW_DETAIL_MODAL,
      {
        data: {
          item: this.value,
        },
      }
    );
  }

  render() {
    if (!this.value) return nothing;

    return html`<uui-button
      label=${this.localize.term("workflow_detail")}
      look="primary"
      @click=${this.#detail}
      >${this.localize.term("workflow_detail")}
    </uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: BaseTableDetailColumnLayoutElement;
  }
}
