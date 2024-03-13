import {
  css,
  customElement,
  html,
  state,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";
import type {
  WorkflowConfirmDeleteGroupModalData,
  WorkflowConfirmDeleteGroupModalResult,
} from "../token/confirm-delete-group-modal.token.js";

const elementName = "workflow-confirm-delete-group-modal";

@customElement(elementName)
export class WorkflowConfirmDeleteGroupModalElement extends UmbModalBaseElement<
  WorkflowConfirmDeleteGroupModalData,
  WorkflowConfirmDeleteGroupModalResult
> {
  @state()
  submitDisabled = true;

  @state()
  submitted = false;

  async #handleSubmit() {
    // TODO => this should use signal r to display messages
    const completed = await this.data?.repository.delete(this.data.unique);

    if (completed) {
      this.submitted = true;
      this.submitDisabled = true;
    }
  }

  #handleClose() {
    if (this.submitted) {
      this.modalContext?.submit();
    } else {
      this.modalContext?.reject();
    }
  }

  #handleInputChange(e: UUIInputEvent) {
    this.submitDisabled = e.target.value !== this.data?.groupName;
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
        <uui-input @keyup=${this.#handleInputChange}></uui-input>
      </div>
      <div slot="actions">
        <uui-button
          id="close"
          label="Close"
          @click="${this.#handleClose}"
        ></uui-button>
        <uui-button
          id="submit"
          color="positive"
          look="primary"
          label="Submit"
          ?disabled=${this.submitDisabled}
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

      h4 {
        margin-top:0;
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
