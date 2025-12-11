import {
  customElement,
  html,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UUIMenuItemElement,
  UUIMenuItemEvent,
} from "@umbraco-cms/backoffice/external/uui";
import { DropdownBaseElement } from "../dropdown.base.element.js";

const elementName = "workflow-page-size";

@customElement(elementName)
export class PageSizeDropdownElement extends DropdownBaseElement<number> {
  #options = [5, 10, 20, 25];

  @property({ type: Number })
  value = this.#options[0];

  #onClick(event: UUIMenuItemEvent) {
    this.select(+(event.target as UUIMenuItemElement)?.label);
  }

  #renderContent() {
    return html`${this.#options.map(
      (option) => html`<uui-menu-item
        label=${option}
        ?active=${option === this.value}
        @click-label=${this.#onClick}
      >
      </uui-menu-item>`
    )}`;
  }

  render() {
    return html` <umb-dropdown label="Page size" id="dropdown" look="outline">
      <span slot="label"><umb-localize key="workflow_pageSize">Page size</umb-localize>: <span>${
        this.value
      }</span></umb-localize></span>
      ${this.#renderContent()}
    </umb-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: PageSizeDropdownElement;
  }
}
