import { html, customElement, css } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type { WorkflowDetailReadonlyModalData } from "@umbraco-workflow/editor-view";

const elementName = "workflow-detail-readonly-modal";

@customElement(elementName)
export class WorkflowDetailReadonlyModalElement extends UmbModalBaseElement<WorkflowDetailReadonlyModalData> {
  #renderLanguageBlock() {
    if (!this.data?.item) return;

    const language =
      this.data?.item.instance?.variantCode !== "*"
        ? this.data?.item.instance?.variantName ?? undefined
        : undefined;

    if (!language) return null;

    return html` <workflow-language-block
      .language=${language}
    ></workflow-language-block>`;
  }

  render() {
    if (!this.data?.item) return;

    return html`
      <umb-body-layout
        .headline=${this.localize.term(
          "workflow_historyFor",
          this.data?.item.node?.name
        )}
      >
        <div id="editor-box">
          <workflow-change-description
            .item=${this.data?.item}
            .comment=${this.data?.item.instance?.comment ?? undefined}
          ></workflow-change-description>
          ${this.#renderLanguageBlock()}
          <workflow-status-block
            .status=${this.data?.item.instance?.status ?? undefined}
          ></workflow-status-block>
          <workflow-scheduling .item=${this.data?.item}></workflow-scheduling>
          <workflow-task-list
            .unique=${this.data?.item.instance?.key}
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
      workflow-status-block {
        display: block;
        margin-top: var(--uui-size-space-5);
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
