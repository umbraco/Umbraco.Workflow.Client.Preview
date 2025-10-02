import { UUIRefNodeElement } from "@umbraco-cms/backoffice/external/uui";
import {
  html,
  customElement,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { WorkflowRefPermissionElementStyles } from "./ref-permission-element.styles.js";
import {
  ApprovalThresholdModel,
  type ApprovalGroupDetailPermissionConfigModel,
} from "@umbraco-workflow/generated";

export interface RefGroupPermissionConfig {
  configureThreshold?: boolean;
  defaultThreshold?: ApprovalThresholdModel;
  basic?: boolean;
}

const elementName = "workflow-ref-group-permission";

@customElement(elementName)
export class WorkflowRefGroupPermissionElement extends UmbElementMixin(
  UUIRefNodeElement
) {
  @property({ type: Object })
  value?: ApprovalGroupDetailPermissionConfigModel;

  @property({ type: Object })
  config: RefGroupPermissionConfig = {
    configureThreshold: false,
    defaultThreshold: ApprovalThresholdModel.ONE,
    basic: false,
  };

  #getName() {
    if (this.name) {
      return this.name;
    }

    if (this.config.basic) {
      return this.value?.name ?? this.name;
    }

    return `${this.localize.term(
      "workflow_stage",
      (this.value?.permission ?? 0) + 1
    )}: ${this.value?.name}`;
  }

  #cycleThresholdValue() {
    if (!this.value) return;

    const approvalThreshold =
      this.value.approvalThreshold === ApprovalThresholdModel.ALL
        ? ApprovalThresholdModel.ONE
        : this.value.approvalThreshold === ApprovalThresholdModel.MOST
        ? ApprovalThresholdModel.ALL
        : ApprovalThresholdModel.MOST;

    this.value = { ...this.value, approvalThreshold };
    this.dispatchEvent(new CustomEvent("approvalThresholdChange"));
  }

  #renderApprovalThreshold() {
    return html` <button
      @click=${this.#cycleThresholdValue}
      ?disabled=${!this.config.configureThreshold}
    >
      <span>${this.localize.term("workflow_requiredApprovals")}:</span>
      ${this.localize.term(`workflow_${this.value?.approvalThreshold.toLowerCase()}`).toLowerCase()}
    </button>`;
  }

  render() {
    return html`
      <span id="icon"><slot name="icon"></slot></span>
      <div id="info">
        <div id="name">${this.#getName()}</div>
        <small id="detail">
          ${when(
            !this.value || this.config.basic,
            () => html`<slot name="detail"></slot>`,
            () => this.#renderApprovalThreshold()
          )}
        </small>
      </div>
      <slot name="actions" id="actions-container"></slot>
    `;
  }

  static styles = [
    ...UUIRefNodeElement.styles,
    ...WorkflowRefPermissionElementStyles,
  ];
}

export default WorkflowRefGroupPermissionElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowRefGroupPermissionElement;
  }
}
