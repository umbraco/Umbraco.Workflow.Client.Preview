import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { TableColumnLayout } from '../table-column-layout.interface.js';
import type { WorkflowInstanceTableResponseModel } from "@umbraco-workflow/generated";

const elementName = "timeline-table-progress-column-layout";

export const TIMELINE_TABLE_PROGRESS_COLUMN_LAYOUT = elementName;

@customElement(elementName)
export class TimelineTableProgressColumnLayoutElement
  extends UmbLitElement
  implements TableColumnLayout<WorkflowInstanceTableResponseModel>
{
  @property({ attribute: false })
  value!: WorkflowInstanceTableResponseModel;

  render() {
    if (!this.value) return nothing;
    return html`<workflow-timeline .item=${this.value}></workflow-timeline>`;
  }

  static styles = [
    css`
      :host {
        display: flex;
        align-items: center;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: TimelineTableProgressColumnLayoutElement;
  }
}
