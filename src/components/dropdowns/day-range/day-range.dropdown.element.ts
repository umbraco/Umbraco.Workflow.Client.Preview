import {
  customElement,
  html,
  ifDefined,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UUIInputElement,
  UUIInputEvent,
} from "@umbraco-cms/backoffice/external/uui";
import { DropdownBaseElement } from "../dropdown.base.element.js";

const elementName = "workflow-day-range";

@customElement(elementName)
export class DayRangeDropdownElement extends DropdownBaseElement<number> {
  /**
   * Set the minimum range value
   */
  @property({ type: Number })
  min?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.value = this.value ?? 28;
  }

  #onChange(event: UUIInputEvent) {
    this.select(+(event.target as UUIInputElement)?.value);
  }

  #renderContent() {
    return html`<uui-input
      .value=${this.value}
      type="number"
      min=${ifDefined(this.min)}
      @change=${this.#onChange}
    ></uui-input>`;
  }

  render() {
    return html` <umb-dropdown label="Day range" compact id="dropdown"
    >
    <span slot="label"><umb-localize key="workflow_dateRange">Day range</umb-localize>: <span>${
      this.value
    }</span></umb-localize></span>
      ${this.#renderContent()}
    </umb-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: DayRangeDropdownElement;
  }
}
