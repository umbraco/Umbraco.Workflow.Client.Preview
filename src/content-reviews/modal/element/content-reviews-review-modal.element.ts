import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  WorkflowContentReviewsReviewModalData,
  WorkflowContentReviewsReviewModalResult,
} from "../token/index.js";
import { WORKFLOW_MANAGER_CONTEXT } from "@umbraco-workflow/context";
import type { ContentReviewsScaffoldResponseModel } from "@umbraco-workflow/generated";

const elementName = "workflow-content-reviews-review-modal";

@customElement(elementName)
export class WorkflowContentReviewsReviewModalElement extends UmbModalBaseElement<
  WorkflowContentReviewsReviewModalData,
  WorkflowContentReviewsReviewModalResult
> {
  @state()
  private _config?: ContentReviewsScaffoldResponseModel;

  @state()
  private _value = "";

  connectedCallback() {
    super.connectedCallback();
    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.scaffold, (scaffold) => {
        if (!scaffold) return;

        this._config = scaffold.review ?? undefined;

        // TODO => min/max doesn't work?

        // const min = new Date();
        // min.setDate(min.getDate() + 1);
        // this._value.min = min.toString();

        // const max = new Date();
        // max.setDate(max.getDate() + (this._config?.reviewPeriod ?? 0));
        // this._value.max = max.toString();
      });
    });
  }

  #handleSubmit() {
    this.modalContext?.setValue({ reviewDate: this._value });
    this._submitModal();
  }

  #onDateChange(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value ?? null;
    this._value = value;
  }

  render() {
    return html`<uui-dialog-layout
      .headline=${this.localize.term("contentReviews_contentRequiresReview")}
    >
      <div id="main">
        <p>
          ${this.localize.term(
            "contentReviews_reviewOverlayPeriod",
            this._config?.reviewPeriod
          )}
        </p>

        <umb-property-layout
          .label=${this.localize.term("contentReviews_nextReviewDue")}
        >
          <umb-input-date
            slot="editor"
            type="datetime-local"
            .value=${this._value}
            @change=${this.#onDateChange}
          ></umb-input-date>
        </umb-property-layout>
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_cancel")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          ?disabled=${!this._value}
          @click=${this.#handleSubmit}
        ></uui-button>
      </div>
    </uui-dialog-layout>`;
  }

  static styles = [css``];
}

export default WorkflowContentReviewsReviewModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowContentReviewsReviewModalElement;
  }
}
