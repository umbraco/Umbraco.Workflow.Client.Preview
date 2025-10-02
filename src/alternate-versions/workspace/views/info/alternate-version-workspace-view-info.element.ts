import {
  css,
  customElement,
  html,
  state,
  when,
  type TemplateResult,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../context/alternate-version-workspace.context-token.js";
import { TimeFormatOptions } from "@umbraco-workflow/core";
import type { AlternateVersionStatusModel } from "@umbraco-workflow/generated";

import "./alternate-version-workspace-view-info-history.element.js";
import "./alternate-version-workspace-view-info-reference.element.js";

const elementName = "workflow-alternate-version-workspace-view-info";

@customElement(elementName)
export class WorkflowAlternateVersionWorkspaceViewInfoElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _documentUnique = "";

  @state()
  private _createDate?: string | null;

  @state()
  private _updateDate?: string | null;

  @state()
  private _publicationStatus?: AlternateVersionStatusModel;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.#workspaceContext = context;
        this.#observeContent();
      }
    );
  }

  #observeContent() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.unique, (unique) => {
      if (!unique) return;

      const data = this.#workspaceContext?.getData();
      this._publicationStatus = data?.status;
      this._createDate = data?.createDate;
      this._updateDate = data?.updateDate;
      this._documentUnique = unique;
    });
  }

  #renderInfoItem(info: TemplateResult | string, key?: string) {
    return html` <div class="general-item">
      <strong><umb-localize key=${`${key}`}></umb-localize></strong>
      ${info}
    </div>`;
  }

  #renderGeneralSection() {
    return html`
      ${this.#renderInfoItem(
        html`<status-tag .value=${this._publicationStatus}></status-tag>`,
        "content_publishStatus"
      )}
      ${when(this._createDate, () =>
        this.#renderInfoItem(
          this.#localizeDate(this._createDate),
          "content_createDate"
        )
      )}
      ${when(this._updateDate, () =>
        this.#renderInfoItem(
          this.#localizeDate(this._updateDate),
          "content_updateDate"
        )
      )}
      ${this.#renderInfoItem(this._documentUnique, "template_id")}
    `;
  }

  #localizeDate(date?: string | null) {
    if (!date) return "";
    return this.localize.date(date, TimeFormatOptions);
  }

  render() {
    return html`
      <div class="container">
        <workflow-alternate-version-workspace-view-info-reference></workflow-alternate-version-workspace-view-info-reference>
        <workflow-alternate-version-workspace-view-info-history></workflow-alternate-version-workspace-view-info-history>
      </div>
      <div class="container">
        <uui-box
          headline=${this.localize.term("general_general")}
          id="general-section"
          >${this.#renderGeneralSection()}</uui-box
        >
      </div>
    `;
  }

  static override styles = [
    css`
      :host {
        display: grid;
        gap: var(--uui-size-layout-1);
        padding: var(--uui-size-layout-1);
        grid-template-columns: 1fr 350px;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-layout-1);
      }

      #general-section {
        display: flex;
        flex-direction: column;
      }

      .general-item {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-space-1);
      }

      .general-item:not(:last-child) {
        margin-bottom: var(--uui-size-space-6);
      }
    `,
  ];
}

export default WorkflowAlternateVersionWorkspaceViewInfoElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionWorkspaceViewInfoElement;
  }
}
