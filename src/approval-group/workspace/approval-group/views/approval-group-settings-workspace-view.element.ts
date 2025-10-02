import {
  css,
  html,
  customElement,
  when,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import type {
  UmbPropertyValueData,
  UmbPropertyDatasetElement,
} from "@umbraco-cms/backoffice/property";
import { spread } from "@open-wc/lit-helpers";
import { WorkflowApprovalGroupWorkspaceViewBaseElement } from "./approval-group-workspace-view-base.element.js";
import type { DayRangeDropdownElement } from "@umbraco-workflow/components";
import { PropertyModifierStyles, getAttributes } from "@umbraco-workflow/core";

const elementName = "workflow-approval-group-settings-workspace-view";

@customElement(elementName)
export class ApprovalGroupSettingsWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBaseElement
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
    return html`<uui-box .headline=${this.localize.term("workflow_activity")}>
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
        <umb-property-dataset
          id="generalSettings"
          .value=${this._group?.properties as Array<UmbPropertyValueData>}
          @change=${this.#onDataChange}
        >
          ${this._group?.properties?.map(
            (p) =>
              html`<umb-property
                ${spread(getAttributes(p, this.isTrial))}
                orientation="vertical"
                .label=${this.localize.term(p.label)}
                .description=${this.localize.term(`${p.label}Description`)}
                alias=${p.alias}
                .config=${p.config}
                property-editor-ui-alias=${p.editorUiAlias}
              ></umb-property>`
          )}</umb-property-dataset
        >
      </uui-box>

      ${when(!this._isNew && this._group?.unique, () =>
        this.#renderWorkflowChart()
      )} `;
  }

  static styles = [
    PropertyModifierStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }

      uui-box + uui-box {
        margin-top: var(--uui-size-layout-1);
      }

      /* restore when property orientation is drilled
      #generalSettings {
        display: flex;
        gap: var(--uui-size-space-6);
      }

      #generalSettings umb-property {
        flex: 1;
      }*/
    `,
  ];
}

export default ApprovalGroupSettingsWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupSettingsWorkspaceViewElement;
  }
}
