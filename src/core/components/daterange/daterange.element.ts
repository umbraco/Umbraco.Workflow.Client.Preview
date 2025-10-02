import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UUIFormControlMixin } from "@umbraco-cms/backoffice/external/uui";

const elementName = "workflow-daterange";

@customElement(elementName)
export class WorkflowDateRangeElement extends UUIFormControlMixin(
  UmbLitElement,
  undefined
) {
  getFormElement() {
    return undefined;
  }

  @property({ type: Array })
  dates: Array<string> = [];

  @property({ type: Array })
  labelKeys: Array<string> = ["template_from", "general_to"];

  @state()
  minDateTo?: string;

  @state()
  maxDateFrom?: string;

  labelFrom: string;
  labelTo: string;

  constructor() {
    super();

    this.maxDateFrom = new Date().toString();
    this.minDateTo = new Date().toString();

    this.labelFrom = this.localize
      .term(this.labelKeys[0])
      .replace(/\b\w/g, (s) => s.toUpperCase());
    this.labelTo = this.localize
      .term(this.labelKeys[1])
      .replace(/\b\w/g, (s) => s.toUpperCase());

    this.addValidator(
      "badInput",
      () => "From date can not be later than the To date",
      () => this.maxDateFrom !== undefined && this.dates[0] > this.maxDateFrom
    );

    this.addValidator(
      "badInput",
      () => "To date can not be earlier than the From date",
      () => this.minDateTo !== undefined && this.dates[1] < this.minDateTo
    );
  }

  #handleChange(e: InputEvent, i: number) {
    const value = (e.target as HTMLInputElement).value ?? null;
    const newDates = [...this.dates];
    newDates[i] = value;
    this.dates = [...newDates];

    if (i === 0) {
      this.minDateTo = value;
    } else {
      this.maxDateFrom = value;
    }

    this.dispatchEvent(new CustomEvent("change"));
  }

  render() {
    return html` <umb-property-layout
        orientation="vertical"
        .label=${this.localize.term(this.labelFrom)}
      >
        <umb-input-date
          slot="editor"
          type="datetime-local"
          .value=${this.dates[0]}
          .max=${this.maxDateFrom}
          @change=${(e: InputEvent) => this.#handleChange(e, 0)}
        ></umb-input-date>
      </umb-property-layout>
      <umb-property-layout
        orientation="vertical"
        .label=${this.localize.term(this.labelTo)}
      >
        <umb-input-date
          slot="editor"
          type="datetime-local"
          .value=${this.dates[1]}
          .max=${this.minDateTo}
          @change=${(e: InputEvent) => this.#handleChange(e, 1)}
        ></umb-input-date>
      </umb-property-layout>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
        align-items: flex-start;
        column-gap: var(--uui-size-3);
      }

      umb-property-layout {
        padding: 0;
        flex: 1;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDateRangeElement;
  }
}
