import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { TaskStatusModel } from "@umbraco-workflow/generated";
import {
  getCommentParts,
  WorkflowColorStyles,
  WorkflowTagColorStyles,
} from "@umbraco-workflow/core";

const elementName = "workflow-status-block";

@customElement(elementName)
export class WorkflowStatusBlockElement extends UmbLitElement {
  @property()
  comment?: string | null;

  @property({ type: String })
  status?: string | null;

  @state()
  private _errorMessage?: string;

  @state()
  private _text = "";

  connectedCallback() {
    super.connectedCallback();
    const { errorMessage } = getCommentParts(this.comment);
    this._errorMessage = errorMessage;

    if (this.status === TaskStatusModel.REJECTED) {
      this.status = TaskStatusModel.AWAITING_RESUBMISSION;
    }

    if (!this.status) return;

    this._text = this.localize.term(
      `workflow_${this.status?.[0].toLowerCase() + this.status?.slice(1)}`
    );
  }

  render() {
    return html` <uui-tag workflow-color=${this.status?.toLowerCase() ?? ""}>
        ${this._text}
      </uui-tag>
      ${when(
        this.status === TaskStatusModel.ERRORED && this._errorMessage,
        () => html` <small>${this._errorMessage}</small>`
      )}`;
  }

  static styles = [
    WorkflowColorStyles,
    WorkflowTagColorStyles,
    css`
      :host {
        --tag-padding: var(--uui-size-space-3);
        --tag-font-size: var(--uui-size-5);
      }

      uui-tag {
        font-size: var(--tag-font-size);
        line-height: 1;
        padding: var(--tag-padding, 3px) calc(var(--tag-padding, 3px) + 0.5em);

        user-select: none;
        border-radius: var(--uui-size-4, 12px);
        background-color: var(--color);
        color: var(--color-contrast);
        text-align: center;
        font-weight: 700;
        display: block;
        margin-bottom: var(--uui-size-6);
        text-transform: uppercase;
      }

      small {
        margin-top: var(--uui-size-2);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowStatusBlockElement;
  }
}
