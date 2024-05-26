import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { WORKFLOW_HISTORY_CLEANUP_MODAL } from "./modal/history-cleanup-modal.token.js";
import { HistoryCleanupService } from "@umbraco-workflow/generated";

const elementName = "workflow-history-cleanup";

@customElement(elementName)
export class WorkflowHistoryCleanupElement extends UmbElementMixin(LitElement) {
  @property()
  unique?: string;

  async #handleClick() {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(
      this,
      WORKFLOW_HISTORY_CLEANUP_MODAL,
      {
        data: {
          unique: this.unique,
        },
      }
    );

    await modalHandler?.onSubmit().catch(() => undefined);
    const result = modalHandler.getValue();
    if (!result) return;

    const { error } = await tryExecuteAndNotify(
      this,
      HistoryCleanupService.putHistoryCleanup({
        requestBody: Object.assign({}, result.nodeRules, result.docTypeRules),
      })
    );

    const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    notificationContext?.peek(error ? "danger" : "positive", {
      data: {
        message: error
          ? "Unable to save workflow history cleanup rules"
          : "Saved workflow history cleanup rules",
      },
    });
  }

  render() {
    return html`<workflow-alert
      .key=${"workflowCleanup_cleanupEnabled"}
      icon="icon-alarm-clock"
    >
      <uui-button
        slot="content"
        @click=${this.#handleClick}
        look="primary"
        compact
        label=${this.localize.term("workflow_detail")}
      ></uui-button>
    </workflow-alert>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
      }

      workflow-alert {
        display: flex;
        margin-left: auto;
        margin-top: var(--uui-size-space-6);
      }

      uui-button {
        margin-left: var(--uui-size-space-6);
      }
    `,
  ];
}

export default WorkflowHistoryCleanupElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryCleanupElement;
  }
}
