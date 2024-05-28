import {
  css,
  customElement,
  html,
  state,
  unsafeHTML,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowConfirmDeleteGroupModalData,
  WorkflowConfirmDeleteGroupModalResult,
} from "../token/confirm-delete-group-modal.token.js";
import { WORKFLOW_SIGNALR_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-confirm-delete-group-modal";

@customElement(elementName)
export class WorkflowConfirmDeleteGroupModalElement extends UmbModalBaseElement<
  WorkflowConfirmDeleteGroupModalData,
  WorkflowConfirmDeleteGroupModalResult
> {
  #messenger?: typeof WORKFLOW_SIGNALR_CONTEXT.TYPE;

  @state()
  private _submitDisabled = true;

  @state()
  private _submitted = false;

  @state()
  private _messages: Array<{ key: string; value: number }> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SIGNALR_CONTEXT, (context) => {
      this.#messenger = context;
      this.#observeMessages();
    });
  }

  #observeMessages() {
    if (!this.#messenger) return;

    this.observe(this.#messenger.action, (action: [string, number]) => {
      this._messages.push({ key: `workflow_${action[0]}`, value: action[1] });
    });
  }

  async #handleSubmit() {
    const completed = await this.data?.repository.delete(this.data.unique);

    if (completed) {
      this._submitted = true;
      this._submitDisabled = true;
    }
  }

  #handleClose() {
    if (this._submitted) {
      this._submitModal();
    } else {
      this._rejectModal();
    }
  }

  #handleInputChange(e: UUIInputEvent) {
    this._submitDisabled = e.target.value !== this.data?.groupName;
  }

  render() {
    return html`<umb-body-layout headline="Confirm delete group">
      <div id="main">
        ${unsafeHTML(
          this.localize.term(
            "workflow_deleteGroupWarning",
            this.data?.groupName
          )
        )}
        <uui-input type="text" @input=${this.#handleInputChange}></uui-input>

        ${when(
          this._messages.length,
          () => html` <ul>
            ${this._messages.map(
              (m) => html` <li>${this.localize.term(m.key)}: ${m.value}</li>`
            )}
          </ul>`
        )}
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click="${this.#handleClose}"
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          ?disabled=${this._submitDisabled}
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      #main {
        max-width: 400px;
      }
    `,
  ];
}

export default WorkflowConfirmDeleteGroupModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowConfirmDeleteGroupModalElement;
  }
}
