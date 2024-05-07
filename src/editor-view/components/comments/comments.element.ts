import type { UUITextareaElement } from "@umbraco-ui/uui-textarea";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-comments";

@customElement(elementName)
export class WorkflowCommentsElement extends UmbElementMixin(LitElement) {
  @property()
  comment? = "";

  @property()
  labelKey!: string;

  @property()
  templateKey = "";

  @property({ type: Boolean })
  mandatory = true;

  @state()
  info = "";

  @property()
  orientation: "horizontal" | "vertical" = "vertical";

  #maxLength = 250;

  #maxLengthStr = this.localize.term(
    "workflow_commentMaxLength",
    this.#maxLength
  );

  connectedCallback() {
    super.connectedCallback();
    // this.onActioned = this.eventsService.on(
    //   constants.events.workflowActioned,
    //   () => this.limitChars()
    // );

    // if (this.templateKey) {
    //   const template = await this.localizationService.localize(
    //     this.templateKey
    //   );

    //   if (!template.startsWith("[") && !template.endsWith("]")) {
    //     this.comment = this.$sce.trustAsHtml(template);
    //   }
    // }

    this.#limitChars();
  }

  /**
   * Optionally provide a numeric value to set the initial counter
   * Used when setting a template as the escaped string doesn't set the model
   * until it is modified, but does have a length
   */
  #limitChars(e?: InputEvent) {
    this.comment = (e?.target as HTMLInputElement)?.value ?? this.comment;
    const length = this.comment?.length ?? 0;

    if (length > this.#maxLength) {
      this.info = this.#maxLengthStr;
      this.comment = this.comment.substring(0, this.#maxLength);
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          comment: this.comment,
          invalid: length > this.#maxLength || (!length && this.mandatory),
        },
      })
    );
  }

  render() {
    return html` <umb-property-layout
      orientation=${this.orientation}
      .label=${this.localize.term(this.labelKey)}
      .description=${this.mandatory
        ? ""
        : this.localize.term("workflow_optional")}
    >
      <div slot="editor">
        <uui-textarea
          label="comment"
          id="workflowComment"
          .value=${this.comment}
          @keyup=${this.#limitChars}
          rows="5"
          ?autoHeight=${true}
          .maxlength=${this.#maxLength}
          .maxlengthMessage=${this.info}
        ></uui-textarea>
      </div>
    </umb-property-layout>`;
  }

  static styles = [
    css`
      umb-property-layout {
        padding: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowCommentsElement;
  }
}
