import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { UmbDocumentPreviewRepository } from "@umbraco-cms/backoffice/document";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";
import {
  WorkflowStatusModel,
  type WorkflowInstanceResponseModel,
  type WorkflowTaskModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";
import { getCommentParts } from "../../../utils/index.js";
import { WORKFLOW_DIFF_MODAL } from "../../../modal/index.js";

const elementName = "workflow-change-description";

@customElement(elementName)
export class WorkflowChangeDescriptionElement extends UmbLitElement {
  @property({ type: Object })
  item?: WorkflowTaskModel | WorkflowInstanceResponseModel;

  @state()
  showDiffBtn = false;

  @property()
  comment?: string;

  @state()
  unlicensed = false;

  @state()
  defaultCulture?: string | null;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;

      const license = context.getLicense();
      this.unlicensed = !license?.isLicensed && !license?.isImpersonating;
    });

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      this.observe(context?.appDefaultLanguage, (defaultLanguage) => {
        this.defaultCulture = defaultLanguage?.unique;
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
        !["Cancelled", "Errored"].includes(
          this.item?.instance?.status as WorkflowStatusModel
        )) ??
      false;
  }

  #setCommentParts() {
    const { comment } = getCommentParts(this.comment);
    this.comment = comment;
  }

  async #preview() {
    // Tell the server that we're entering preview mode.
    await new UmbDocumentPreviewRepository(this).enter();

    const culture =
      this.item?.instance?.cultureCode === "*"
        ? this.defaultCulture
        : this.item?.instance?.cultureCode;

    const preview = window.open(
      `preview?id=${this.item?.node?.key}&culture=${culture}`,
      "umbpreview"
    );
    preview?.focus();
  }

  async #showDiff() {
    if (!this.item?.instance?.key) throw new Error("instance data is missing");

    await umbOpenModal(this, WORKFLOW_DIFF_MODAL, {
      data: {
        instanceKey: this.item?.instance?.key,
      },
    });
  }

  #renderAttachmentButton() {
    if (!this.item?.instance?.attachment) return null;

    return html` <uui-button
      look="outline"
      color="default"
      .href=${this.item?.instance?.attachment}
      target="_blank"
      label=${this.localize.term("workflow_viewAttachment")}
    ></uui-button>`;
  }

  #renderLanguageAndSegments() {
    if (
      this.item?.instance?.cultureCode === "*" &&
      !this.item.instance.segments
    ) {
      return;
    }

    return html`<uui-tag
        >${this.localize.term("general_language")}:
        ${this.item?.instance?.cultureName}</uui-tag
      >
      ${when(
        this.item?.instance?.segments,
        () =>
          html`<uui-tag
            >${this.localize.term("workflow_segments")}:
            ${this.item?.instance?.segments}</uui-tag
          >`
      )}`;
  }

  render() {
    if (!this.item) return null;

    return html`<uui-box
      headline=${this.localize.term("workflow_changeDescription")}
    >
      ${this.#renderLanguageAndSegments()}

      <workflow-task-info
        .name=${this.item.instance?.requestedBy}
        .date=${this.item.instance?.requestedOn}
        .comment=${this.comment}
      ></workflow-task-info>

      <workflow-expander-display
        .value=${this.item.instance?.expander}
        .entityType=${this.item.instance?.entityType}
      >
      </workflow-expander-display>

      <div id="buttons">
        <uui-button
          look="secondary"
          @click=${this.#preview}
          label=${this.localize.term("general_preview")}
        ></uui-button>

        ${this.#renderAttachmentButton()}
        ${when(
          this.showDiffBtn,
          () => html`
            <uui-button
              @click=${this.#showDiff}
              label=${this.localize.term("workflow_showDiff")}
              look="secondary"
            ></uui-button>
          `
        )}
      </div>
    </uui-box> `;
  }

  static styles = css`
    :host {
      display: block;
    }

    #buttons {
      display: flex;
      gap: var(--uui-size-space-2);
      margin-top: var(--uui-size-space-5);
    }

    uui-tag {
      margin-bottom: var(--uui-size-4);
    }

    uui-box {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowChangeDescriptionElement;
  }
}
