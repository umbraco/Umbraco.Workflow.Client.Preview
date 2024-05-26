import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { WorkflowContentReviewsRegenerateModalResult } from "../token/index.js";

const elementName = "workflow-content-reviews-regenerate-modal";

@customElement(elementName)
export class WorkflowContentReviewsRegenerateModalElement extends UmbModalBaseElement<
  never,
  WorkflowContentReviewsRegenerateModalResult
> {
  @state()
  relativeTo?: 0 | 1;

  @state()
  force = false;

  #handleSubmit() {
    this.value = {
      relativeTo: this.relativeTo === undefined ? 0 : this.relativeTo,
      force: this.force,
    };
    this.modalContext?.submit();
  }

  #handleClose() {
    this.modalContext?.reject();
  }

  render() {
    return html`<umb-body-layout>
      <div id="main">
        <p>${this.localize.term("contentReviews_saveReviewConfigMessage")}</p>
        <umb-property-layout
          .label=${this.localize.term("contentReviews_generateRelativeTo")}
        >
          <uui-radio-group
            @change=${(e) => (this.relativeTo = e.target.value)}
            slot="editor"
          >
            <uui-radio value=${0} .label=${this.localize.term("workflow_now")}>
            </uui-radio>
            <uui-radio
              value=${1}
              .label=${this.localize.term("content_lastPublished")}
            >
            </uui-radio>
          </uui-radio-group>
        </umb-property-layout>
        <umb-property-layout
          .label=${this.localize.term("contentReviews_force")}
          .description=${this.localize.term("contentReviews_forceDescription")}
        >
          <uui-toggle
            slot="editor"
            ?checked=${this.force}
            @change=${() => (this.force = !this.force)}
          >
          </uui-toggle>
        </umb-property-layout>
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
          label="Ok"
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }

  static styles = [
    css`
      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }

      #main {
        max-width: 600px;
      }
    `,
  ];
}

export default WorkflowContentReviewsRegenerateModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsRegenerateModalElement;
  }
}
