import { UUIRefNodeElement } from "@umbraco-cms/backoffice/external/uui";
import {
  html,
  customElement,
  property,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UserGroupPermissionsModel } from "@umbraco-workflow/generated";

export interface RefGroupPermissionConfig {
  configureThreshold?: boolean;
  defaultThreshold?: number;
  basic?: boolean;
}

const elementName = "workflow-ref-group-permission";

@customElement(elementName)
export class WorkflowRefGroupPermissionElement extends UmbElementMixin(
  UUIRefNodeElement
) {
  protected fallbackIcon =
    '<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M142.212 397.267l106.052-48.024L398.479 199.03l-26.405-26.442-90.519 90.517-15.843-15.891 90.484-90.486-16.204-16.217-150.246 150.243-47.534 106.513zm74.904-100.739l23.285-23.283 3.353 22.221 22.008 3.124-23.283 23.313-46.176 20.991 20.813-46.366zm257.6-173.71L416.188 64.3l-49.755 49.785 58.504 58.503 49.779-49.77zM357.357 300.227h82.826v116.445H68.929V300.227h88.719v-30.648H38.288v177.733h432.537V269.578H357.357v30.649z"></path></svg>';

  selectable: boolean = false;

  @property({ type: Object })
  value?: UserGroupPermissionsModel;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Number })
  stage?: number;

  @property({ type: Object })
  config: RefGroupPermissionConfig = {
    configureThreshold: false,
    defaultThreshold: 0,
    basic: false,
  };

  allMostOneLabels: Array<string> = [];

  connectedCallback(): void {
    super.connectedCallback();

    // order here MUST reflect the enum order
    this.allMostOneLabels = [
      this.localize.term("workflow_one"),
      this.localize.term("workflow_most"),
      this.localize.term("workflow_all"),
    ];
  }

  #getName() {
    if (this.config.basic) {
      return this.value?.groupName ?? this.name;
    }

    if (this.value) {
      return `Stage ${(this.value.permission ?? 0) + 1}: ${
        this.value.groupName
      }`;
    }

    return `Stage ${(this.stage ?? 0) + 1}: ${this.name}`;
  }

  #cycleThresholdValue() {
    if (!this.value) return;

    const approvalThreshold =
      this.value.approvalThreshold === 2
        ? 0
        : this.value.approvalThreshold === 1
        ? 2
        : 1;

    this.value = { ...this.value, approvalThreshold };
    this.dispatchEvent(new CustomEvent("approvalThresholdChange"));
  }

  #renderApprovalThreshold() {
    if (!this.value || this.config.basic) return;

    return html`<small id="detail">
      <slot name="detail">
        <button
          @click=${this.#cycleThresholdValue}
          id="thresholdButton"
          ?disabled=${!this.config.configureThreshold}
        >
          <span>${this.localize.term("workflow_requiredApprovals")}:</span>
          ${this.allMostOneLabels[this.value?.approvalThreshold ?? 0]}
        </button>
      </slot></small
    >`;
  }

  render() {
    return html`
      <div id="open-part" tabindex="0">
        <span id="icon"><slot name="icon"></slot></span>
        <div id="info">
          <div id="name">${this.#getName()}</div>
          ${this.#renderApprovalThreshold()}
        </div>
      </div>
      <!-- Select border must be right after #open-part -->
      <div id="select-border"></div>
      <slot></slot>
      <slot name="tag"></slot>
      <slot name="actions" id="actions-container"></slot>
    `;
  }

  static styles = [
    ...UUIRefNodeElement.styles,
    css`
      #open-part:hover #name,
      #open-part:hover #icon {
        color: var(--uui-color-text) !important;
        text-decoration: none !important;
      }

      #thresholdButton {
        cursor: pointer;
      }

      #detail {
        line-height: 1;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowRefGroupPermissionElement;
  }
}
