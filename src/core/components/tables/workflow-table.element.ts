import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { PageSizeDropdownElement } from "../dropdowns/index.js";
import type { WorkflowTableBaseElement } from "./table-base.element.js";
import { type TableQueryModel } from "@umbraco-workflow/core";
import type { FilterPickerElement } from "@umbraco-workflow/components";

const elementName = "workflow-table";

@customElement(elementName)
export class WorkflowTableElement extends UmbLitElement {
  @property({ type: Object })
  config?: TableQueryModel;

  @property()
  headline = "";

  #element?: WorkflowTableBaseElement;

  #fetch() {
    if (!this.config?.handler || !this.#element) return;
    this.#element.model = this.config;
  }

  #onPageSizeChange(e: CustomEvent) {
    this.config!.pageSize = (e.target as PageSizeDropdownElement).value;
    this.#fetch();
  }

  #onSlotChange(e) {
    this.#element = e.target.assignedElements().at(0) as WorkflowTableBaseElement;
    this.#fetch();
  }

  #onFilterChange(e: CustomEvent) {
    const filters = (e.target as FilterPickerElement).value;
    if (!filters) return;

    this.config!.filters = { ...filters };
    this.#fetch();
  }

  render() {
    return html`<uui-box .headline=${this.headline}>
      <div slot="header-actions">
        ${when(
          this.config?.filterConfig,
          () => html` <workflow-filter-picker
            @change=${this.#onFilterChange}
            .config=${this.config?.filterConfig}
          >
          </workflow-filter-picker>`
        )}
        <workflow-page-size
          @change=${this.#onPageSizeChange}
          .value=${this.config?.pageSize ?? 5}
        ></workflow-page-size>
      </div>

      <slot @slotchange=${this.#onSlotChange}></slot>
    </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: block;
      }

      [slot="header-actions"] {
        display: flex;
        justify-content: space-between;
        align-items: center;
        column-gap: var(--uui-size-space-2);
      }
    `,
  ];
}

export default WorkflowTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTableElement;
  }
}
