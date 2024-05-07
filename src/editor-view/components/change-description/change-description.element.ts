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
import { UmbHistoryItemElement } from "@umbraco-cms/backoffice/components";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { getCommentParts } from "@umbraco-workflow/core";
import { WORKFLOW_DIFF_MODAL } from "@umbraco-workflow/editor-view";
import type {
  WorkflowInstanceResponseModel,
  WorkflowTaskModel,
} from "@umbraco-workflow/generated";
import { WorkflowStatusModel } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-change-description";

@customElement(elementName)
export class WorkflowChangeDescriptionElement extends UmbElementMixin(
  LitElement
) {
  @property({ type: Object })
  item?: WorkflowInstanceResponseModel | WorkflowTaskModel;

  @state()
  showDiffBtn = false;

  @property()
  comment?: string;

  @state()
  unlicensed = false;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      if (!instance) return;
      this.observe(instance.license, (license) => {
        this.unlicensed = !license?.isLicensed && !license?.isImpersonating;
      });
    });
  }

  connectedCallback() {
    super.connectedCallback();

    this.#setCommentParts();

    this.showDiffBtn =
      (!this.unlicensed &&
        this.item?.node?.exists &&
        !this.item.node.new &&
        ![WorkflowStatusModel.CANCELLED, WorkflowStatusModel.ERRORED].includes(
          this.item?.instance?.status as WorkflowStatusModel
        )) ??
      false;
  }

  #setCommentParts() {
    const { comment } = getCommentParts(this.comment);
    this.comment = comment;
  }

  #preview() {
    alert("preview");
  }

  async #showDiff() {
    if (!this.item?.instance?.key) throw new Error("instance data is missing");

    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_DIFF_MODAL, {
      data: {
        instanceKey: this.item?.instance?.key,
      },
    });
    await modalHandler?.onSubmit();
  }

  #renderAttachmentButton() {
    if (!this.item?.instance?.attachment) return null;

    return html` <uui-button
      look="outline"
      color="default"
      .href=${this.item?.instance?.attachment}
      target="_blank"
    >
      ${this.localize.term("workflow_viewAttachment")}
    </uui-button>`;
  }

  render() {
    if (!this.item) return null;

    return html`<uui-box headline=${this.localize.term(
      "workflow_changeDescription"
    )}>
        <div id="wrapper">
          <div class="user-info">
            <uui-avatar
              color="var(--uui-color-current)"
              name=${this.item.instance?.requestedBy ?? ""}
            >
            </uui-avatar>
            <div>
                <span class="name">${this.item.instance?.requestedBy}</span>
                <span
                class="detail"
                >${this.item.instance?.requestedOn}</span>
            </div>
          </div>
          <div class="slots-wrapper">
            <uui-icon name="quote"></uui-icon>
            <p id="comment">${this.comment}</p>
            </div>         
        </div>

        <div id="buttons">
          <uui-button
            look="primary"
            @click=${this.#preview}
            label="Preview"
          >${this.localize.term("general_preview")}
          </uui-button>

          ${this.#renderAttachmentButton()}         

          ${when(
            this.showDiffBtn,
            () => html`
              <uui-button
                @click=${this.#showDiff}
                label="Show diff"
                look="primary"
              >
                ${this.localize.term("workflow_showDiff")}...
              </uui-button>
            `
          )}
        </div>
      </umb-box-content>
    </uui-box> `;
  }

  static styles = [
    UmbHistoryItemElement.styles,

    css`
      :host {
        display: block;
      }
      #wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--uui-size-space-5);
      }

      #comment {
        font-style: italic;
        margin: 0;
      }

      #buttons {
        display: flex;
        gap: var(--uui-size-space-2);
        margin-top: var(--uui-size-space-5);
      }

      uui-icon {
        width: calc(2em + 4px);
        height: calc(2em + 4px);
        color: var(--uui-color-disabled);
        margin-right: var(--uui-size-space-5);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowChangeDescriptionElement;
  }
}
