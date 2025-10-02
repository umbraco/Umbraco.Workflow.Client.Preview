import {
  customElement,
  html,
  nothing,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import WorkflowContentCalendarDayDetailModalBaseElement from "./content-calendar-day-detail-modal-base.element.js";

const elementName = "content-calendar-day-detail-modal";

@customElement(elementName)
export class WorkflowContentCalendarDayDetailModalElement extends WorkflowContentCalendarDayDetailModalBaseElement {
  connectedCallback() {
    super.connectedCallback();

    this.items = [...(this.data?.day.items ?? [])];
  }

  renderSubmit() {
    return nothing;
  }

  renderItems() {
    if (!this.items.length)
      return this.localize.term("workflow_calendar_noItems");

    return html`<uui-ref-list
      >${repeat(
        this.items,
        (item) => item.unique,
        (item) =>
          html`<workflow-ref-calendar-item .name=${item.name}>
            <umb-icon slot="icon" .name=${"icon-document"}></umb-icon>
          </workflow-ref-calendar-item>`
      )}</uui-ref-list
    >`;
  }
}

export default WorkflowContentCalendarDayDetailModalElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarDayDetailModalElement;
  }
}
