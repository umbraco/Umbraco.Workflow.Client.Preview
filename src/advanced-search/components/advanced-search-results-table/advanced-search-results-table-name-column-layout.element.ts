import {
  UMB_DOCUMENT_ENTITY_TYPE,
} from "@umbraco-cms/backoffice/document";
import {
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WorkflowWorkspaceModalRouterController } from "@umbraco-workflow/core";
import type { AdvancedSearchResponseItemModel } from "@umbraco-workflow/generated";

const elementName = "workflow-advanced-search-results-table-name-column-layout";

@customElement(elementName)
export class WorkflowAdvancedSearchResultsTableNameColumnLayoutElement extends UmbLitElement {
  @property({ type: Object })
  value?: AdvancedSearchResponseItemModel;

  @state()
  private _editDocumentPath = "";

  async connectedCallback() {
    super.connectedCallback();

    this._editDocumentPath = await firstValueFrom(
      new WorkflowWorkspaceModalRouterController(this, UMB_DOCUMENT_ENTITY_TYPE).path
    );
  }
  
  #editDocument() {
    window.history.pushState(null, "", `${this._editDocumentPath}edit/${this.value?.key}`);
  }

  render() {
    return html`<uui-button
      compact
      @click=${this.#editDocument}
      .label=${this.value?.name ?? ""}
    ></uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchResultsTableNameColumnLayoutElement;
  }
}
