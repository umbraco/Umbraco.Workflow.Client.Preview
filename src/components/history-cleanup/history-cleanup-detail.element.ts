import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  customElement,
  html,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { WorkflowHistoryCleanupRuleSet } from "@umbraco-workflow/modal";
import type { HistoryCleanupConfigModel } from "@umbraco-workflow/generated";

const elementName = "workflow-history-cleanup-detail";

@customElement(elementName)
export class WorkflowHistoryCleanupDetailElement extends UmbElementMixin(
  LitElement
) {
  @property({ type: Object })
  model: WorkflowHistoryCleanupRuleSet = {};

  @property({ type: Boolean })
  hideName = false;

  @property({ type: Boolean })
  editable = false;

  #emitValueChange(valueSetter) {
    valueSetter();
    this.dispatchEvent(
      new CustomEvent("change", { detail: Object.values(this.model)[0] })
    );
    this.requestUpdate("model");
  }

  connectedCallback() {
    super.connectedCallback();
  }

  #renderHistoryCleanupEnabledCell(value: HistoryCleanupConfigModel) {
    return html`<uui-table-cell>
      ${when(
        !this.editable,
        () => html`<uui-icon
          .name=${value.enableCleanup ? "check" : "delete"}
          style="--uui-icon-color: ${value.enableCleanup ? "green" : "red"}"
        ></uui-icon>`,
        () => html` <uui-toggle
          ?disabled=${!value.editable}
          ?checked=${value.enableCleanup}
          .label=${value.entityName}
          @change=${() =>
            this.#emitValueChange(
              () => (value.enableCleanup = !value.enableCleanup)
            )}
        >
        </uui-toggle>`
      )}</uui-table-cell
    >`;
  }

  #renderDaysToKeepHistoryCell(value: HistoryCleanupConfigModel) {
    return html`<uui-table-cell>
      ${when(
        this.editable,
        () => html`<uui-input
          type="number"
          .value=${value.keepHistoryForDays}
          ?disabled=${!value.enableCleanup || !value.editable}
          @input=${(e) =>
            this.#emitValueChange(
              () => (value.keepHistoryForDays = Number(e.target.value))
            )}
        ></uui-input>`,
        () => html`${value.keepHistoryForDays}`
      )}</uui-table-cell
    >`;
  }

  #renderStatusesToDeleteCell(value: HistoryCleanupConfigModel) {
    return html`<uui-table-cell>
      <ul>
        ${Object.entries(value.statusesToDelete ?? []).map((status) => {
          const [statusKey, statusValue] = status;

          return html`<li>
            ${when(
              this.editable,
              () => html` <div>
                <umb-property-layout
                  .label=${this.localize.term(
                    `workflow_${statusKey.toLowerCase()}`
                  )}
                >
                  <uui-toggle
                    slot="editor"
                    ?disabled=${!value.editable || !value.enableCleanup}
                    ?checked=${value.statusesToDelete![statusKey]}
                    .label=${value.entityName}
                    @change=${() =>
                      this.#emitValueChange(
                        () =>
                          (value.statusesToDelete![statusKey] =
                            !value.statusesToDelete![statusKey])
                      )}
                  >
                  </uui-toggle>
                </umb-property-layout>
              </div>`
            )}
            ${when(
              !this.editable && statusValue,
              () => html` <umb-localize
                .key=${`workflow_${statusKey.toLowerCase()}`}
                >${statusKey}</umb-localize
              >`
            )}
          </li>`;
        })}
      </ul></uui-table-cell
    >`;
  }

  render() {
    return html`<uui-table>
      <uui-table-head>
        ${when(
          !this.editable && !this.hideName,
          () => html` <uui-table-head-cell
            >${this.localize.term("general_name")}</uui-table-head-cell
          >`
        )}
        <uui-table-head-cell
          >${this.localize.term(
            "workflowCleanup_cleanupEnabled"
          )}</uui-table-head-cell
        >
        <uui-table-head-cell
          >${this.localize.term(
            "workflowCleanup_daysToKeepHistory"
          )}</uui-table-head-cell
        >
        <uui-table-head-cell style="min-width:225px"
          >${this.localize.term(
            "workflowCleanup_statusesToDelete"
          )}</uui-table-head-cell
        >
      </uui-table-head>
      ${Object.values(this.model).map(
        (value) => html`<uui-table-row>
          ${when(
            !this.editable && !this.hideName,
            () => html` <uui-table-cell>${value.entityName}</uui-table-cell>`
          )}
          ${this.#renderHistoryCleanupEnabledCell(value)}
          ${this.#renderDaysToKeepHistoryCell(value)}
          ${this.#renderStatusesToDeleteCell(value)}
        </uui-table-row>`
      )}
    </uui-table>`;
  }

  static styles = [
    css`
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      umb-property-layout {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowHistoryCleanupDetailElement;
  }
}
