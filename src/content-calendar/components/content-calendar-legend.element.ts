import {
  css,
  customElement,
  html,
  repeat,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_CONTENT_CALENDAR_CONTEXT } from '../context/index.js';
import type { CalendarLegendItem } from '../entities.js';

const elementName = "workflow-content-calendar-legend";

@customElement(elementName)
export class WorkflowContentCalendarLegendElement extends UmbLitElement {
  @state()
  private _items: Array<CalendarLegendItem> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTENT_CALENDAR_CONTEXT, (context) => {
      if (!context) return;
      
      this.observe(context.legend$, (legend) => {
        this._items = legend;
      });
    });
  }

  render() {
    return html`${repeat(
        this._items,
        (item) => item.key,
        (item) =>
          html`<uui-tag id=${`legend-${item.type}`}
            >${this.localize.term(item.key)}</uui-tag
          >`
      )}<slot name="legend"></slot>`;

    return html` <uui-tag id="contentItemBadge">Content item</uui-tag>
      <uui-tag id="releaseSetBadge">Release set</uui-tag>
      <uui-tag id="releaseSetItemBadge">Release set item</uui-tag>
      <slot name="legend"></slot>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
        gap: var(--uui-size-2);
        align-items: center;
      }

      #legend-1 {
        background-color: var(--uui-color-selected);
        color: #fff;
      }

      #legend-2 {
        background-color: var(--uui-palette-malibu-dark);
        color: #fff;
      }

      #legend-3 {
        background-color: var(--uui-palette-malibu-light);
        color: #fff;
      }
    `,
  ];
}

export default WorkflowContentCalendarLegendElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarLegendElement;
  }
}
