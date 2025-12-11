import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";

const elementName = "workflow-comments";

@customElement(elementName)
export class WorkflowCommentsElement extends UmbLitElement {
  @property()
  label = this.localize.term("workflow_describeChanges");

  @property({ type: Boolean })
  mandatory = true;

  @property()
  orientation: "horizontal" | "vertical" = "horizontal";

  @property()
  value = "";

  @property()
  description = "";

  @state()
  info = "";

  #maxLength = 250;

  #maxLengthStr = this.localize.term(
    "workflow_commentMaxLength",
    this.#maxLength
  );

  connectedCallback() {
    super.connectedCallback();
    this.#limitChars();
  }

  /**
   * Optionally provide a numeric value to set the initial counter
   * Used when setting a template as the escaped string doesn't set the model
   * until it is modified, but does have a length
   */
  #limitChars(e?: InputEvent) {
    this.value = (e?.target as HTMLInputElement)?.value ?? this.value;

    if (this.length > this.#maxLength) {
      this.info = this.#maxLengthStr;
      this.value = this.value.substring(0, this.#maxLength);
    }

    this.dispatchEvent(new UmbChangeEvent());
  }

  get length() {
    return this.value?.length ?? 0;
  }

  get invalid() {
    const length = this.value?.length ?? 0;
    return length > this.#maxLength || (!length && this.mandatory);
  }

  render() {
    return html` <umb-property-layout
      orientation=${this.orientation}
      .label=${this.label}
      ?mandatory=${this.mandatory}
      .description=${this.description}
    >
      <uui-textarea
        slot="editor"
        label="comment"
        .value=${this.value}
        @keyup=${this.#limitChars}
        rows="5"
        ?autoHeight=${true}
        .maxlength=${this.#maxLength}
        .maxlengthMessage=${this.info}
      ></uui-textarea>
    </umb-property-layout>`;
  }

  static styles = [
    css`
      umb-property-layout {
        padding: 0;
        --uui-textarea-min-height: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowCommentsElement;
  }
}
