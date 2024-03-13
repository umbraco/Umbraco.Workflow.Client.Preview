import {
  html,
  customElement,
  property,
  LitElement,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbModalContext } from "@umbraco-cms/backoffice/modal";
import type { WorkflowGroupDetailModalData } from '../token/group-detail-modal.token.js';

const elementName = "workflow-group-detail-modal";

@customElement(elementName)
export class WorkflowGroupDetailModalElement extends UmbElementMixin(
  LitElement
) {
  @property({ attribute: false })
  modalContext?: UmbModalContext<WorkflowGroupDetailModalData, unknown>;

  @property({ type: Object })
  data?: WorkflowGroupDetailModalData;

  #close() {
    this.modalContext?.reject();
  }

  render() {
    return html`
      <umb-body-layout .headline=${this.data?.group.name ?? ""}>
        <div id="editor-box">
          <uui-table class="uui-text">
            <uui-table-head>
              <uui-table-head-cell
                >${this.localize.term("general_name")}</uui-table-head-cell
              >
              <uui-table-head-cell
                >${this.localize.term("general_email")}</uui-table-head-cell
              >
            </uui-table-head>
            ${repeat(
              this.data?.group.users ?? [],
              (user) => user.userId,
              (user) => html`
                <uui-table-row>
                  <uui-table-cell>${user.name}</uui-table-cell>
                  <uui-table-cell
                    ><a href="mailto:${user.email}"
                      >${user.email}</a
                    ></uui-table-cell
                  >
                </uui-table-row>
              `
            )}
          </uui-table>
        </div>
        <div slot="actions">
          <uui-button id="close" label="Close" @click="${this.#close}"
            >Close</uui-button
          >
        </div>
      </umb-body-layout>
    `;
  }
}

export default WorkflowGroupDetailModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowGroupDetailModalElement;
  }
}
