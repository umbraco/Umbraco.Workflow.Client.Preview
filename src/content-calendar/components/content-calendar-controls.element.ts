import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_CONTENT_CALENDAR_CONTEXT } from "../context/index.js";
import { CalendarViewValues } from "../entities.js";

const elementName = "workflow-content-calendar-controls";

@customElement(elementName)
export class WorkflowContentCalendarControlsElement extends UmbLitElement {
  #calendarContext?: typeof WORKFLOW_CONTENT_CALENDAR_CONTEXT.TYPE;

  @state()
  private _currentDate?: string;

  @state()
  private _currentView?: string;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTENT_CALENDAR_CONTEXT, (context) => {
      this.#calendarContext = context;

      this.#observeView();
      this.#observeCurrentDate();
    });
  }

  #observeCurrentDate() {
    if (!this.#calendarContext) return;
    this.observe(this.#calendarContext.currentDate$, (currentDate) => {
      this._currentDate = currentDate;
    });
  }

  #observeView() {
    if (!this.#calendarContext) return;
    this.observe(this.#calendarContext.currentView$, (currentView) => {
      this._currentView = currentView;
    });
  }

  #goTo(idx: 1 | -1) {
    this.#calendarContext?.goTo(idx);
  }

  #goToToday() {
    this.#calendarContext?.goToToday();
  }

  #toggleView() {
    this.#calendarContext?.toggleView();
  }

  render() {
    return html` <div class="flex" id="calendarNav">
        <uui-button
          compact
          type="button"
          @click=${() => this.#goTo(-1)}
          look="outline"
          label=${this.localize.term("general_previous")}
        >
          <uui-icon name="icon-navigation-left"></uui-icon>
        </uui-button>
        <div id="currentDate">${this._currentDate}</div>
        <uui-button
          compact
          type="button"
          @click=${() => this.#goTo(1)}
          look="outline"
          label=${this.localize.term("general_next")}
          ><uui-icon name="icon-navigation-right"></uui-icon>
        </uui-button>
      </div>
      <div class="flex">
        <uui-button
          type="button"
          @click=${this.#goToToday}
          label=${this.localize.term("workflow_goToToday")}
          look="outline"
        ></uui-button>
        <uui-button-group>
          <uui-button
            type="button"
            @click=${this.#toggleView}
            label=${this.localize.term("workflow_month")}
            look=${this._currentView === CalendarViewValues.Month
              ? "primary"
              : "outline"}
          ></uui-button>
          <uui-button
            type="button"
            @click=${this.#toggleView}
            label=${this.localize.term("workflow_week")}
            look=${this._currentView === CalendarViewValues.Week
              ? "primary"
              : "outline"}
          ></uui-button>
        </uui-button-group>
      </div>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
        gap: var(--uui-size-3);
        align-items: flex-end;
        padding: var(--uui-size-2);
        background: white;
        border-radius: var(--uui-border-radius);
      }

      .flex {
        display: flex;
        align-items: center;
        gap: var(--uui-size-2);
      }
    `,
  ];
}

export default WorkflowContentCalendarControlsElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarControlsElement;
  }
}
