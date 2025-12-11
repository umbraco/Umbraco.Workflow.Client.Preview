import {
  css,
  html,
  customElement,
  state,
  nothing,
  repeat,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { UMB_WORKSPACE_MODAL } from "@umbraco-cms/backoffice/workspace";
import { UmbModalRouteRegistrationController } from "@umbraco-cms/backoffice/router";
import { RELEASESET_ENTITY_TYPE } from "@umbraco-workflow/release-sets";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../context/alternate-version-workspace.context-token.js";
import type { ReleaseSetCollectionResponseModel } from "@umbraco-workflow/generated";

const elementName = "workflow-alternate-version-workspace-view-info-reference";

@customElement(elementName)
export class WorkflowAlternateVersionWorkspaceViewInfoReferenceElement extends UmbLitElement {
  @state()
  private _editDocumentPath = "";

  @state()
  private _items?: Array<ReleaseSetCollectionResponseModel> = [];

  constructor() {
    super();

    new UmbModalRouteRegistrationController(this, UMB_WORKSPACE_MODAL)
      .addAdditionalPath(RELEASESET_ENTITY_TYPE)
      .onSetup(() => ({
        data: { entityType: RELEASESET_ENTITY_TYPE, preset: {} },
      }))
      .observeRouteBuilder((routeBuilder) => {
        this._editDocumentPath = routeBuilder({});
      });
  }

  protected override firstUpdated(): void {
    this.#getReferences();
  }

  async #getReferences() {
    const context = await this.getContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT
    );
    if (!context) {
      throw new Error(
        "Could not find context: WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT"
      );
    }

    this._items = context.getData()?.sets ?? [];
  }

  override render() {
    if (this._items && this._items.length > 0) {
      return html` <uui-box
        headline=${this.localize.term("workflow_releaseSets_referencedBy")}
        style="--uui-box-default-padding:0"
      >
        <uui-table>
          <uui-table-head>
            <uui-table-head-cell
              style="text-align: center; --uui-table-cell-padding: 0"
            ></uui-table-head-cell>
            <uui-table-head-cell
              ><umb-localize key="general_name"
                >Name</umb-localize
              ></uui-table-head-cell
            >
            <uui-table-head-cell
              ><umb-localize key="general_status"
                >Status</umb-localize
              ></uui-table-head-cell
            >
          </uui-table-head>

          ${repeat(
            this._items,
            (item) => item,
            (item) =>
              html`<uui-table-row>
                <uui-table-cell
                  style="text-align:center; width:61px; box-sizing: border-box"
                >
                  <umb-icon .name=${item.icon ?? "icon-document"}></umb-icon>
                </uui-table-cell>
                <uui-table-cell class="link-cell">
                  <uui-button
                    compact
                    .label=${`${item.name}`}
                    href=${`${this._editDocumentPath}edit/${item.unique}`}
                  ></uui-button>
                </uui-table-cell>
                <uui-table-cell>
                  <status-tag .value=${item.status}> </status-tag>
                </uui-table-cell>
              </uui-table-row>`
          )}
        </uui-table>
      </uui-box>`;
    } else {
      return nothing;
    }
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: contents;
      }
      uui-table-cell:not(.link-cell) {
        color: var(--uui-color-text-alt);
      }
    `,
  ];
}

export default WorkflowAlternateVersionWorkspaceViewInfoReferenceElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAlternateVersionWorkspaceViewInfoReferenceElement;
  }
}
