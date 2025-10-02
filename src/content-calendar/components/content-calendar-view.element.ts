import {
  css,
  customElement,
  html,
  property,
  repeat,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { umbOpenModal } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_CONTENT_CALENDAR_CONTEXT } from "../context/index.js";
import type { CalendarItem, CalendarDay } from "../entities.js";
import type { WorkflowContentCalendarDayElement } from "./content-calendar-day.element.js";

const elementName = "workflow-content-calendar-view";

@customElement(elementName)
export class WorkflowContentCalendarViewElement extends UmbLitElement {
  #calendarContext?: typeof WORKFLOW_CONTENT_CALENDAR_CONTEXT.TYPE;

  @property({ type: Array })
  items: Array<CalendarItem> = [];

  @state()
  private _days: Record<string, CalendarDay> = {};

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTENT_CALENDAR_CONTEXT, (context) => {
      this.#calendarContext = context;
      this.#observeDays();
    });
  }

  #observeDays() {
    if (!this.#calendarContext) return;

    this.observe(this.#calendarContext.days$, (days) => {
      this._days = days;
    });
  }

  async #handleDayClick(e: CustomEvent, date: string) {
    if (!this.#calendarContext) return;

    const day = (e.target as WorkflowContentCalendarDayElement).value;
    if (!day) return;

    await umbOpenModal(this, this.#calendarContext.detailModalContext, {
      data: {
        day,
        date,
      },
    }).catch(() => {});
  }

  #renderDaysHeader() {
    return repeat(
      this.#calendarContext!.daysOfWeek,
      (day) => day,
      (day) => html`<div class="header">${day}</div>`
    );
  }

  #renderDays() {
    return repeat(
      Object.keys(this._days),
      (day) => day,
      (day, idx) => html`<workflow-content-calendar-day
        ?start=${idx % 7 === 0}
        ?end=${idx % 7 === 6}
        .key=${day}
        @click=${(e) => this.#handleDayClick(e, day)}
      ></workflow-content-calendar-day>`
    );
  }

  render() {
    return html`${this.#renderDaysHeader()}${this.#renderDays()}`;
  }

  static styles = [
    css`
      :host {
        display: grid;
        flex: 1;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        grid-gap: 4px;
        margin-top: var(--uui-size-7);
        border-radius: var(--uui-size-1);
        padding: 0 4px 4px;
        background: var(--uui-color-background);
        overflow: hidden;
      }

      .header {
        aspect-ratio: 5 / 1;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ];
}

export default WorkflowContentCalendarViewElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarViewElement;
  }
}
