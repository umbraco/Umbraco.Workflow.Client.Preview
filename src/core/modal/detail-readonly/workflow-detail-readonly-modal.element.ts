import {
  html,
  customElement,
  css,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import {
  InstanceDetailModel,
  InstanceService,
  type WorkflowInstanceResponseModel,
} from "@umbraco-workflow/generated";
import type { WorkflowDetailReadonlyModalData } from "./workflow-detail-readonly-modal.token.js";

const elementName = "workflow-detail-readonly-modal";

@customElement(elementName)
export class WorkflowDetailReadonlyModalElement extends UmbModalBaseElement<WorkflowDetailReadonlyModalData> {
  @state()
  private _workflow?: WorkflowInstanceResponseModel;

  @state()
  private _instance?: InstanceDetailModel | null;

  @state()
  private _loading = true;

  @state()
  private _error?: string;

  async connectedCallback() {
    super.connectedCallback();

    const { data, error } = await tryExecute(
      this,
      InstanceService.getInstance({
        query: {
          unique: this.data?.unique,
        },
      })
    );

    if (error) {
      this._error = error.message;
      this._loading = false;
      return;
    }

    this._workflow = data;
    this._instance = data.instance;
    this._loading = false;
  }

  #renderSchedulingBlock() {
    if (!this._instance?.releaseDate && !this._instance?.expireDate)
      return null;

    return html` <workflow-scheduling-block
      release-date=${this._instance.releaseDate ?? ""}
      expire-date=${this._instance.expireDate ?? ""}
      ?complete=${!!this._instance.completedOn}
      .status=${this._instance.status}
      .action=${this._instance.type}
    ></workflow-scheduling-block>`;
  }

  #render() {
    if (!this._workflow) return html`<div id="center">${this._error}</div>`;

    return html`<div id="detail">
      <workflow-change-description
        .item=${this._workflow}
        .comment=${this._instance?.comment ?? undefined}
      ></workflow-change-description>
      ${this.#renderSchedulingBlock()}
      <workflow-task-list
        .unique=${this._instance?.key}
        .status=${this._instance?.status}
        .comment=${this._instance?.comment}
      ></workflow-task-list>
    </div>`;
  }

  render() {
    return html`
      <umb-body-layout
        .headline=${this._workflow
          ? this.localize.term("workflow_historyFor", this._workflow.node?.name)
          : ""}
      >
        ${when(
          this._loading,
          () => html`<div id="center"><uui-loader></uui-loader></div>`,
          () => this.#render()
        )}

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
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-layout-1);
      }

      #center {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
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
