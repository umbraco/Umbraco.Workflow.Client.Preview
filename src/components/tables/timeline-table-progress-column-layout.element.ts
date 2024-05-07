import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  nothing,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { WorkflowInstanceResponseModel } from "@umbraco-workflow/generated";

const elementName = "timeline-table-progress-column-layout";

export const TIMELINE_TABLE_PROGRESS_COLUMN_LAYOUT = elementName;

@customElement(elementName)
export class TimelineTableProgressColumnLayoutElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  value!: WorkflowInstanceResponseModel;

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
