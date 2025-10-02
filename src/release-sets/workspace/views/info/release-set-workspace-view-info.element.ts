import {
  css,
  customElement,
  html,
  nothing,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../release-set-workspace.context-token.js";
import { TimeFormatOptions } from "@umbraco-workflow/core";
import type {
  ReleaseSetStatusModel,
  UserItemModel,
} from "@umbraco-workflow/generated";

import "./release-set-workspace-view-info-history.element.js";

const elementName = "workflow-release-set-workspace-view-info";

@customElement(elementName)
export class WorkflowReleaseSetWorkspaceViewInfoElement extends UmbLitElement {
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _unique = "";

  @state()
  private _owner?: UserItemModel;

  @state()
  private _createDate?: string | null;

  @state()
  private _updateDate?: string | null;

  @state()
  private _releaseDate?: string | null;

  @state()
  private _publicationStatus?: ReleaseSetStatusModel;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
      this.#observeContent();
    });
  }

  #observeContent() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.data, (data) => {
      if (!data) return;

      this._publicationStatus = data.status;
      this._createDate = data.createDate;
      this._updateDate = data.updateDate;
      this._releaseDate = data.releaseDate;
      this._owner = data.owner;
      this._unique = data.unique;
    });
  }

  #renderGeneralSection() {
    return html`
      <div class="general-item">
        <strong>${this.localize.term("content_publishStatus")}</strong>
        <span><status-tag .value=${this._publicationStatus}></status-tag></span>
      </div>

      <div class="general-item">
        <strong>${this.localize.term("workflow_releaseSets_createdBy")}</strong>
        <span>${this._owner?.name}</span>
      </div>

      ${this.#renderDate(this._releaseDate, "content_releaseDate")}
      ${this.#renderDate(this._createDate, "content_createDate")}
      ${this.#renderDate(this._updateDate, "content_updateDate")}

      <div class="general-item">
        <strong>${this.localize.term("template_id")}</strong>
        <span>${this._unique}</span>
      </div>
    `;
  }

  #renderDate(date?: string | null, key?: string) {
    if (!date) return nothing;

    return html`
      <div class="general-item">
        <strong><umb-localize .key=${`${key}`}></umb-localize></strong>
        <span>
          <umb-localize-date
            .date=${date}
            .options=${TimeFormatOptions}
          ></umb-localize-date>
        </span>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="container">
        <workflow-releaseset-workspace-view-info-history></workflow-releaseset-workspace-view-info-history>
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
    UmbTextStyles,
    css`
      :host {
        display: grid;
        gap: var(--uui-size-layout-1);
        padding: var(--uui-size-layout-1);
        grid-template-columns: 1fr 350px;
      }

      div.container {
        display: flex;
        flex-direction: column;
        gap: var(--uui-size-layout-1);
      }

      //General section

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

export default WorkflowReleaseSetWorkspaceViewInfoElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetWorkspaceViewInfoElement;
  }
}
