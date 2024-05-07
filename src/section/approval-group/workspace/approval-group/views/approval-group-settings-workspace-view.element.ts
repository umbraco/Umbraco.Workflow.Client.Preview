import {
  css,
  html,
  customElement,
  when,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import type {
  UmbPropertyValueData,
  UmbPropertyDatasetElement,
} from "@umbraco-cms/backoffice/property";
import { WorkflowApprovalGroupWorkspaceViewBase } from "./approval-group-workspace-view-base.element.js";
import { BoxHeaderFlexStyles } from "@umbraco-workflow/css";
import type { DayRangeDropdownElement } from "@umbraco-workflow/components";

const elementName = "workflow-approval-group-settings-workspace-view";

@customElement(elementName)
export class ApprovalGroupSettingsWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  @state()
  chartRange = 28;

  async connectedCallback() {
    super.connectedCallback();
    await this.init;
  }

  #updateChartRange($event: CustomEvent) {
    this.chartRange = ($event.target as DayRangeDropdownElement).value;
  }

  #renderWorkflowChart() {
    return html`<uui-box>
      <div slot="headline">${this.localize.term("workflow_activity")}</div>
      <workflow-day-range
        slot="header-actions"
        value=${this.chartRange}
        @change=${this.#updateChartRange}
      ></workflow-day-range>

      <workflow-activity-chart
        .groupId=${this._group!.unique!}
        .range=${this.chartRange}
      ></workflow-activity-chart>
    </uui-box>`;
  }

  #onDataChange(e: Event) {
    const newValue = (e.target as UmbPropertyDatasetElement).value;
    this._group?.properties.forEach((p) => {
      this.workspaceContext?.setPropertyValue(
        newValue.find((x) => x.alias === p.alias)?.value,
        p.alias
      );
    });
  }

  render() {
    return html`<uui-box .headline=${this.localize.term("general_settings")}>
        <div id="generalSettings">
          <umb-property-dataset
            .value=${this._group?.properties as Array<UmbPropertyValueData>}
            @change=${this.#onDataChange}
          >
            ${this._group?.properties?.map(
              (p) =>
                html`<umb-property
                  .label=${this.localize.term(p.label)}
                  .description=${this.localize.term(p.description)}
                  alias=${p.alias}
                  .config=${p.config}
                  property-editor-ui-alias=${p.editorUiAlias}
                ></umb-property>`
            )}</umb-property-dataset
          >
        </div>
      </uui-box>

      ${when(!this._isNew && this._group?.unique, () =>
        this.#renderWorkflowChart()
      )} `;
  }

  static styles = [
    BoxHeaderFlexStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }

      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }

      #generalSettings {
        display: flex;
        gap: var(--uui-size-space-6);
      }

      #generalSettings umb-workspace-property-layout {
        flex: 1;
      }
    `,
  ];
}

export default ApprovalGroupSettingsWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupSettingsWorkspaceViewElement;
  }
}
