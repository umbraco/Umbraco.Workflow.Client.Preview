import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_CONTENT_CALENDAR_CONTEXT } from "../context/index.js";
import type { CalendarConfig } from "../entities.js";

const elementName = "workflow-content-calendar";

@customElement(elementName)
export class WorkflowContentCalendarElement extends UmbLitElement {
  @state()
  private _config?: CalendarConfig;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTENT_CALENDAR_CONTEXT, (context) => {
      if (!context) return;
      this._config = context.config;
    });
  }

  render() {
    return html`<div id="header">
        ${when(
          !this._config?.hideLegend,
          () =>
            html` <workflow-content-calendar-legend></workflow-content-calendar-legend>`
        )}
        <workflow-content-calendar-controls></workflow-content-calendar-controls>
      </div>
      <workflow-content-calendar-view></workflow-content-calendar-view>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        position: relative;
      }
      #header {
        display: flex;
        justify-content: space-between;
      }

      workflow-content-calendar-controls {
        margin-left: auto;
      }
    `,
  ];
}

export default WorkflowContentCalendarElement;

declare global {
  interface HTMLElementTagMap {
    [elementName]: WorkflowContentCalendarElement;
  }
}
