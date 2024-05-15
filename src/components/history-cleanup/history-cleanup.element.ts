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
import { WORKFLOW_HISTORY_CLEANUP_MODAL } from './modal/history-cleanup-modal.token.js';
import { HistoryCleanupService } from "@umbraco-workflow/generated";

const elementName = "workflow-history-cleanup";

@customElement(elementName)
export class WorkflowHistoryCleanupElement extends UmbElementMixin(LitElement) {
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  @property()
  unique?: string;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (instance) => {
      if (!instance) return;
      this.#notificationContext = instance;
    });
  }

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

    const result = await modalHandler?.onSubmit();
    if (!result) return;

    const { error } = await tryExecuteAndNotify(
      this,
      HistoryCleanupService.putHistoryCleanup({
        requestBody: Object.assign({}, result.nodeRules, result.docTypeRules),
      })
    );

    this.#notificationContext?.peek(error ? "danger" : "positive", {
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
        .label=${"Detail"}
        .compact=${true}
        >${this.localize.term("workflow_detail")}
      </uui-button>
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

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryCleanupElement;
  }
}
