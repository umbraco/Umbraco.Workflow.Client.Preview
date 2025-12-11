import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";

const elementName = "workflow-table-date-column-layout";

@customElement(elementName)
export class WorkflowTableDateColumnLayoutElement extends UmbLitElement {
  @property({ attribute: false })
  value!: string;

  #options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };

  render() {
    if (!this.value) return nothing;

    return html`${this.localize.date(this.value, this.#options)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowTableDateColumnLayoutElement;
  }
}
