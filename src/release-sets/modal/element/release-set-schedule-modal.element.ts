import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import type { UmbInputDateElement } from "@umbraco-cms/backoffice/components";
import type {
  WorkflowReleaseSetScheduleModalData,
  WorkflowReleaseSetScheduleModalValue,
} from "../token/index.js";
import { formatDate } from "@umbraco-workflow/core";

const elementName = "releaseset-schedule-modal";

@customElement(elementName)
export class WorkflowReleaseSetScheduleModalElement extends UmbModalBaseElement<
  WorkflowReleaseSetScheduleModalData,
  WorkflowReleaseSetScheduleModalValue
> {
  @state()
  private _releaseDate?: string | null;

  connectedCallback(): void {
    super.connectedCallback();

    this._releaseDate = this.data?.releaseDate;
  }

  #submit() {
    this.value = { releaseDate: this._releaseDate };
    this.modalContext?.submit();
  }

  #onFromDateChange(e: Event) {
    this._releaseDate = (e.target as UmbInputDateElement).value.toString();
  }

  #renderPublishDateInput() {
    return html`<div class="publish-date">
      <uui-form-layout-item>
        <uui-label slot="label"
          >${this.localize.term("content_releaseDate")}</uui-label
        >
        <div>
          <umb-input-date
            type="datetime-local"
            @change=${this.#onFromDateChange}
            .value=${formatDate(this._releaseDate)}
            label=${this.localize.term("content_releaseDate")}
          >
            <div slot="append">
              ${when(
                this._releaseDate,
                () => html`
                  <uui-button
                    compact
                    label=${this.localize.term("general_clear")}
                    @click=${() => (this._releaseDate = null)}
                  >
                    <uui-icon name="remove"></uui-icon>
                  </uui-button>
                `
              )}
            </div></umb-input-date
          >
        </div>
      </uui-form-layout-item>
    </div>`;
  }

  override render() {
    return html`<uui-dialog-layout
      headline=${this.localize.term("general_scheduledPublishing")}
    >
      ${this.#renderPublishDateInput()}

      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          label=${this.localize.term("buttons_schedulePublish")}
          look="primary"
          color="positive"
          @click=${this.#submit}
        ></uui-button>
      </div>
    </uui-dialog-layout> `;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        min-width: 600px;
        max-width: 90vw;
      }

      .publish-date {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
      }

      .publish-date > uui-form-layout-item {
        flex: 1;
        margin: 0;
        padding: 0.5rem 0 1rem;
      }

      [slot="label"] {
        display: flex;
        flex: 1;
        align-items: center;
      }

      [slot="label"] span {
        margin-right: auto;
      }
    `,
  ];
}

export default WorkflowReleaseSetScheduleModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetScheduleModalElement;
  }
}
