import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowStatus } from "@umbraco-workflow/core";

const elementName = "workflow-scheduling-block";

@customElement(elementName)
export class WorkflowSchedulingBlockElement extends UmbLitElement {
  @property({ attribute: "release-date" })
  releaseDate?: string;

  @property({ attribute: "expire-date" })
  expireDate?: string;

  @property({ type: Boolean })
  complete = false;

  @property({ type: String })
  status?;

  @property({ type: String })
  action?;

  @state()
  scheduledDatePassed? = false;

  @state()
  scheduledDate?: Date;

  #releaseDate?: Date;
  #expireDate?: Date;

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.releaseDate && !this.expireDate) return;

    this.#releaseDate = this.releaseDate
      ? new Date(this.releaseDate)
      : undefined;
    this.#expireDate = this.expireDate ? new Date(this.expireDate) : undefined;
    const now = new Date();

    if (!this.complete) return;

    this.scheduledDatePassed =
      ((this.#releaseDate && this.#releaseDate < now) ||
        (this.#expireDate && this.#expireDate < now)) &&
      this.status === WorkflowStatus.PENDING_APPROVAL;
  }

  #getScheduledMessage() {
    const rawDate = this.releaseDate ?? this.expireDate;
    if (!rawDate) return;

    return this.localize.term(
      "workflow_scheduledForAt",
      this.action?.toLowerCase(),
      this.localize.date(rawDate, { dateStyle: "long" }),
      this.localize.date(rawDate, { timeStyle: "short" })
    );
  }

  render() {
    return html`<uui-box headline=${this.localize.term("workflow_scheduling")}>
      <p>${this.#getScheduledMessage()}</p>
      ${when(
        this.scheduledDatePassed,
        () => html` <div>
          <small>${this.localize.term("workflow_schedulePassed")} </small>
        </div>`
      )}
    </uui-box>`;
  }

  static styles = [
    css`
      p {
        margin-top: 0;
      }

      small {
        display: block;
        line-height: 1.4;
        border-left: 2px solid var(--uui-color-danger);
        padding-left: var(--uui-size-space-3);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSchedulingBlockElement;
  }
}
