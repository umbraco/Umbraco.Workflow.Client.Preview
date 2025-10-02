import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import type {
  UmbInputDateElement,
  UmbInputRadioButtonListElement,
} from "@umbraco-cms/backoffice/components";
import type {
  ReleaseSetVersionSchedule,
  WorkflowReleaseSetVersionScheduleModalData,
  WorkflowReleaseSetVersionScheduleModalValue,
} from "../token/index.js";
import { VersionExpireActionModel } from "@umbraco-workflow/generated";
import { formatDate } from "@umbraco-workflow/core";

const elementName = "releaseset-version-schedule-modal";

@customElement(elementName)
export class WorkflowReleaseSetItemScheduleModalElement extends UmbModalBaseElement<
  WorkflowReleaseSetVersionScheduleModalData,
  WorkflowReleaseSetVersionScheduleModalValue
> {
  @state()
  private _schedule: ReleaseSetVersionSchedule = {};

  @state()
  private _hasExpireDate = false;

  #expireActions = [
    {
      value: VersionExpireActionModel.REVERT,
      label: this.localize.term("workflow_releaseSets_revert"),
    },
    {
      value: VersionExpireActionModel.UNPUBLISH,
      label: this.localize.term("content_unpublish"),
    },
  ];

  #publishMin?: string;
  #unpublishMin?: string;

  async connectedCallback() {
    super.connectedCallback();

    if (!this.data?.version) return;

    this.#publishMin =
      this.data.minReleaseDate ?? this.#dateToString(new Date());

    this._hasExpireDate = Boolean(this.data.version.expireDate?.length);
    this._schedule = {
      unique: this.data.version.unique,
      releaseDate: this.data.version.releaseDate,
      expireAction: this.data.version.expireAction,
      expireDate: this.data.version.expireDate,
    };
  }

  #pad(x: number) {
    return x.toLocaleString("en-US", { minimumIntegerDigits: 2 });
  }

  #dateToString(date: Date) {
    return `${date.getFullYear()}-${this.#pad(date.getMonth() + 1)}-${this.#pad(
      date.getDate()
    )} ${this.#pad(date.getHours())}:${this.#pad(date.getMinutes())}`;
  }

  #submit() {
    // ensure values are not empty string - must be null
    this._schedule.expireDate =
      this._schedule.expireDate === "" ? null : this._schedule.expireDate;
    this._schedule.releaseDate =
      this._schedule.releaseDate === "" ? null : this._schedule.releaseDate;

    this.value = this._schedule;
    this.modalContext?.submit();
  }

  #setSelectionProperty(prop: Partial<ReleaseSetVersionSchedule>) {
    this._schedule = {
      ...this._schedule,
      ...prop,
    };
  }

  #onFromDateChange(e: Event) {
    const releaseDate = (e.target as UmbInputDateElement).value.toString();
    this.#setSelectionProperty({
      releaseDate,
    });

    this.#unpublishMin = this.#dateToString(new Date(releaseDate));
  }

  #onToDateChange(e: Event) {
    this.#setSelectionProperty({
      expireDate: (e.target as UmbInputDateElement).value.toString(),
    });
    this._hasExpireDate = Boolean(this._schedule.expireDate?.length);
  }

  #onExpireActionChange(e: Event) {
    this.#setSelectionProperty({
      expireAction: (e.target as UmbInputRadioButtonListElement)
        .value as VersionExpireActionModel,
    });
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
              .min=${this.#publishMin}
              .value=${formatDate(this.data?.version.releaseDate)}
              label=${this.localize.term("general_publishDate")}
              ><div slot="append">
                ${when(
                  this.data?.version.releaseDate,
                  () => html`
                    <uui-button
                      compact
                      label=${this.localize.term("general_clear")}
                      @click=${() => (this.data!.version.releaseDate = null)}
                    >
                      <uui-icon name="remove"></uui-icon>
                    </uui-button>
                  `
                )}
              </div></umb-input-date
            >
          </div>
        </uui-form-layout-item>
        <uui-form-layout-item>
          <uui-label slot="label"
            >${this.localize.term("content_unpublishDate")}</uui-label
          >
          <div>
            <umb-input-date
              type="datetime-local"
              @change=${this.#onToDateChange}
              .min=${this.#unpublishMin}
              .value=${formatDate(this.data?.version.expireDate)}
              label=${this.localize.term("general_publishDate")}
              ><div slot="append">
                ${when(
                  this.data?.version.expireDate,
                  () => html`
                    <uui-button
                      compact
                      label=${this.localize.term("general_clear")}
                      @click=${() => (this.data!.version.expireDate = null)}
                    >
                      <uui-icon name="remove"></uui-icon>
                    </uui-button>
                  `
                )}
              </div></umb-input-date
            >
          </div>
        </uui-form-layout-item>
      </div>
      ${when(
        this._hasExpireDate,
        () => html` <uui-form-layout-item
          ><uui-label slot="label">
            ${this.localize.term("workflow_releaseSets_unpublishAction")}
          </uui-label>
          <div>
            <umb-input-radio-button-list
              @change=${this.#onExpireActionChange}
              .value=${this.data?.version.expireAction ??
              VersionExpireActionModel.REVERT}
              .list=${this.#expireActions}
            ></umb-input-radio-button-list>
          </div>
        </uui-form-layout-item>`
      )}`;
  }

  override render() {
    return html`<uui-dialog-layout
      headline=${this.localize.term(
        "workflow_releaseSets_scheduleVersionPublishing",
        this.data?.version.name
      )}
    >
      <p>
        ${this.localize.term(
          "workflow_releaseSets_scheduleVersionPublishingDescription"
        )}
      </p>

      ${when(this._schedule.unique, () => this.#renderPublishDateInput())}

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
        max-width: 600px;
      }

      .publish-date {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
        border-top: 1px solid var(--uui-color-border);
        border-bottom: 1px solid var(--uui-color-border);
      }

      .publish-date > uui-form-layout-item {
        flex: 1;
        margin: 0;
        padding: 0.5rem 0 1rem;
      }

      .publish-date > uui-form-layout-item:first-child {
        border-right: 1px dashed var(--uui-color-border);
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

export default WorkflowReleaseSetItemScheduleModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetItemScheduleModalElement;
  }
}
