import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { WORKFLOW_HISTORY_CLEANUP_MODAL } from "./modal/history-cleanup-modal.token.js";
import { HistoryCleanupService } from "@umbraco-workflow/generated";
import { WORKFLOW_HISTORY_ICON } from "../constants.js";

const elementName = "workflow-history-cleanup";

@customElement(elementName)
export class WorkflowHistoryCleanupElement extends UmbLitElement {
  @property()
  unique?: string | null;

  async #handleClick() {
    const result = await umbOpenModal(this, WORKFLOW_HISTORY_CLEANUP_MODAL, {
      data: {
        unique: this.unique ?? undefined,
      },
    }).catch(() => {});

    if (!result) return;

    await tryExecute(
      this,
      HistoryCleanupService.putHistoryCleanup({
        body: Object.assign({}, result.nodeRules, result.docTypeRules),
      })
    );
  }

  render() {
    return html`<workflow-alert
      .key=${"workflow_cleanup_cleanupEnabled"}
      icon=${WORKFLOW_HISTORY_ICON}
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
