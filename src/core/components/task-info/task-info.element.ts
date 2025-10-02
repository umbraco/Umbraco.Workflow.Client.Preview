import { UmbHistoryItemElement } from "@umbraco-cms/backoffice/components";
import {
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

const elementName = "workflow-task-info";

@customElement(elementName)
export class WorkflowTaskInfoElement extends UmbLitElement {
  @property()
  avatar?: string;

  @property()
  name?: string | null;

  @property()
  date?: string | null;

  @property()
  comment?: string | null;

  @property({ type: Boolean })
  admin = false;

  @property({ type: Boolean })
  indent = false;

  readonly #dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  render() {
    return html`
      <div class="user-info">
        <uui-avatar
          name=${this.avatar ?? this.name ?? ""}
          style="--uui-palette-spanish-pink: ${this.avatar === "!"
            ? "var(--uui-color-warning)"
            : "var(--uui-palette-spanish-pink)"}"
          >${this.avatar}</uui-avatar
        >
        <div>
          <span
            >${this.name}
            ${when(
              this.admin,
              () => html` (${this.localize.term("workflow_asAdmin")})`
            )}</span
          >
          ${when(
            this.date,
            () => html` <span class="detail"
              ><umb-localize-date
                .date=${this.date}
                .options=${this.#dateOptions}
              ></umb-localize-date>
            </span>`
          )}
        </div>
        <slot name="tag"></slot>
      </div>
      ${when(
        this.comment,
        () => html` <div>
          <p id="comment">${this.comment}</p>
        </div>`
      )}
    `;
  }

  static styles = [
    UmbHistoryItemElement.styles,
    css`
      :host {
        display: block;
      }

      #comment {
        font-style: italic;
      }

      :host([indent]) #comment {
        margin: var(--uui-size-4) 0 0 calc(2em + 4px + var(--uui-size-space-5));
      }

      slot[name="tag"] {
        display: block;
        margin-left: auto;
      }

      .user-info {
        align-items: center;
      }
    `,
  ];
}

export default WorkflowTaskInfoElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowTaskInfoElement;
  }
}
