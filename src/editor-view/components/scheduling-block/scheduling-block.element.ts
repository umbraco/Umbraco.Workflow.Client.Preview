import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { WorkflowStatus } from "@umbraco-workflow/core";
import type { WorkflowTaskModel } from "@umbraco-workflow/generated";

const elementName = "workflow-scheduling-block";

@customElement(elementName)
export class WorkflowSchedulingBlockElement extends UmbElementMixin(
  LitElement
) {
  @property({ type: Object })
  item?: WorkflowTaskModel;

  @state()
  scheduledDatePassed? = false;

  @state()
  scheduledDate?: Date;

  releaseDate?: Date;
  expireDate?: Date;

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.item?.instance?.releaseDate && !this.item?.instance?.expireDate)
      return;

    this.releaseDate = this.item?.instance?.releaseDate
      ? new Date(this.item?.instance?.releaseDate)
      : undefined;
    this.expireDate = this.item?.instance?.expireDate
      ? new Date(this.item?.instance?.expireDate)
      : undefined;
    const now = new Date();

    this.scheduledDatePassed =
      ((this.releaseDate && this.releaseDate < now) ||
        (this.expireDate && this.expireDate < now)) &&
      this.item.status === WorkflowStatus.PENDING_APPROVAL;
  }

  #getScheduledMessage() {
    const action = this.item?.type?.toLowerCase();

    return this.localize.term("workflow_scheduledForAt", action);
  }

  render() {
    return html`<uui-box headline=${this.localize.term("workflow_scheduling")}>
      <p>${this.#getScheduledMessage()}</p>
      ${when(
        this.scheduledDatePassed,
        () => html` <div class="flex items-center">
          <uui-icon name="alert"></uui-icon>
          <small>${this.localize.term("workflow_schedulePassed")} </small>
        </div>`
      )}
    </uui-box>`;
  }

  static styles = [
    css`
      uui-icon {
        color: var(--uui-color-danger);
        margin-right: var(--uui-size-space-3);
        font-size: var(--uui-size-space-9);
      }

      p {
        margin: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSchedulingBlockElement;
  }
}
