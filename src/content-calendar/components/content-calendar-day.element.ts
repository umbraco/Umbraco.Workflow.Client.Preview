import {
  css,
  customElement,
  html,
  property,
  repeat,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_CONTENT_CALENDAR_CONTEXT } from "../context/index.js";
import type { CalendarDay, CalendarItem } from "../entities.js";

const elementName = "workflow-content-calendar-day";

@customElement(elementName)
export class WorkflowContentCalendarDayElement extends UmbLitElement {
  @property()
  key?: string;

  @property({ reflect: true, type: Boolean })
  today = false;

  @property({ reflect: true, type: Boolean })
  affix = false;

  @property({ reflect: true, type: Boolean })
  outline = false;

  @property({ reflect: true, type: Boolean })
  empty = true;

  @property({ type: Object })
  value?: CalendarDay;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTENT_CALENDAR_CONTEXT, (context) => {
      if (!context) return;

      this.today = context.isToday(this.key);

      this.observe(context.days$, (days) => {
        this.value = days[this.key!];
        if (!this.value) return;

        this.affix = this.value.isAffix;
        this.empty = this.value.items.length === 0;
      });

      this.observe(context.updateOutline$, () => {
        this.outline = context.isOutline(this.key);
      });
    });
  }

  #renderOverflow() {
    return html`<div id="overflow">
      <span>${this.value!.items.length} items</span>
    </div>`;
  }

  #calculateStack(item: CalendarItem) {
    const idx = this.value!.items.findIndex((x) => x.unique === item.unique);
    if (!item.stack || item.stack === 0) return 0;
    return (item.stack - idx) * -100;
  }

  render() {
    if (!this.value) return;

    return html`<span id="date">${this.value.display}</span>
      <div class="items-wrapper">
        ${repeat(
          this.value.items.slice(0, 3),
          (item) => item.unique,
          (item) =>
            html`<workflow-content-calendar-day-item
              .key=${this.key}
              .item=${item}
              .stack=${this.#calculateStack(item)}
            ></workflow-content-calendar-day-item>`
        )}
        ${when(this.value.items.length > 3, () => this.#renderOverflow())}
      </div>`;
  }

  static styles = [
    css`
      :host {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        background: white;
        aspect-ratio: 1 / 1;
        padding: var(--uui-size-1);
        border-radius: var(--uui-size-1);
      }

      :host(:not([empty]):hover) {
        opacity: 0.67;
      }

      :host([affix]) {
        background: transparent;
        opacity: 0.25;

        --color-block-border: var(--uui-color-background);
      }

      :host([outline]) {
        outline: 1px dashed var(--uui-color-default);
      }

      :host([today]) {
        background: var(--uui-color-current);

        --color-block-border: var(--uui-color-current);

        #date {
          font-weight: bold;
        }
      }

      /* sunday */
      :host([start]) {
        overflow: hidden;
      }

      /* saturday */
      :host([end]) {
        overflow: hidden;
      }

      #date {
        position: absolute;
        z-index: 1;
        line-height: 1.2;
        font-size: var(--uui-size-4);
      }

      .items-wrapper {
        display: flex;
        flex: 1;
        position: relative;
        flex-direction: column-reverse;
      }
    `,
  ];
}

export default WorkflowContentCalendarDayElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarDayElement;
  }
}
