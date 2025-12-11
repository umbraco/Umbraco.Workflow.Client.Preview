import { css, customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WorkflowContentCalendarContext } from "./context/content-calendar.context.js";

const elementName = "workflow-content-calendar-dashboard";

@customElement(elementName)
export class ContentCalendarDashboardElement extends UmbLitElement {
  constructor() {
    super();

    new WorkflowContentCalendarContext(this, { hideLegend: true });
  }

  render() {
    return html`<uui-box>
      <workflow-content-calendar></workflow-content-calendar>
    </uui-box>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default ContentCalendarDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ContentCalendarDashboardElement;
  }
}
