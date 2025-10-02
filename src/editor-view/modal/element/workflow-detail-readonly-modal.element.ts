import {
  html,
  customElement,
  css,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { WorkflowDetailReadonlyModalData } from "@umbraco-workflow/editor-view";
import {
  InstanceService,
  type WorkflowInstanceResponseModel,
} from "@umbraco-workflow/generated";

const elementName = "workflow-detail-readonly-modal";

@customElement(elementName)
export class WorkflowDetailReadonlyModalElement extends UmbModalBaseElement<WorkflowDetailReadonlyModalData> {
  @state()
  private _workflow?: WorkflowInstanceResponseModel;

  async connectedCallback() {
    super.connectedCallback();

    const { data } = await tryExecute(
      this,
      InstanceService.getInstance({
        query: {
          unique: this.data?.unique,
        },
      })
    );

    this._workflow = data;
  }

  #renderSchedulingBlock() {
    if (
      !this._workflow?.instance?.releaseDate &&
      !this._workflow?.instance?.expireDate
    )
      return null;

    return html` <workflow-scheduling-block
      release-date=${this._workflow.instance.releaseDate ?? ""}
      expire-date=${this._workflow.instance.expireDate ?? ""}
      ?complete=${!!this._workflow.instance.completedOn}
      .status=${this._workflow.instance.status}
      .action=${this._workflow.instance.type}
    ></workflow-scheduling-block>`;
  }

  render() {
    if (!this._workflow) return;

    return html`
      <umb-body-layout
        .headline=${this.localize.term(
          "workflow_historyFor",
          this._workflow.node?.name
        )}
      >
        <div id="detail">
          <workflow-change-description
            .item=${this._workflow}
            .comment=${this._workflow.instance?.comment ?? undefined}
          ></workflow-change-description>
          ${this.#renderSchedulingBlock()}
          <workflow-task-list
            .unique=${this._workflow.instance?.key}
            .status=${this._workflow.instance?.status}
            .comment=${this._workflow.instance?.comment}
          ></workflow-task-list>
        </div>
        <uui-button
          slot="actions"
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
      </umb-body-layout>
    `;
  }

  static styles = [
    css`
      #detail {
        --column-count: 1;

        display: grid;
        grid-template-columns: repeat(var(--column-count), [col-start] 1fr);
        gap: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default WorkflowDetailReadonlyModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowDetailReadonlyModalElement;
  }
}
