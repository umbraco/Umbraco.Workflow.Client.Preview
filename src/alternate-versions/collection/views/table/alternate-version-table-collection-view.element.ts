import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableDeselectedEvent,
  UmbTableElement,
  UmbTableItem,
  UmbTableSelectedEvent,
} from "@umbraco-cms/backoffice/components";
import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UMB_COLLECTION_CONTEXT,
  type UmbDefaultCollectionContext,
} from "@umbraco-cms/backoffice/collection";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import type { WorkflowAlternateVersionCollectionModel } from "../../types.js";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../../constants.js";
import { TimeFormatOptions } from "@umbraco-workflow/core";

import "./elements/alternate-version-table-name-column-layout.element.js";
import "./elements/alternate-version-table-inset-column-layout.element.js";

const elementName = "alternate-versions-table";

@customElement(elementName)
export class AlternateVersionsTableElement extends UmbLitElement {
  #collectionContext?: UmbDefaultCollectionContext<WorkflowAlternateVersionCollectionModel>;
  workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _loading = true;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: true,
  };

  @state()
  private _modalPath?: string;

  @state()
  private _selection: Array<string> = [];

  @state()
  private _tableColumns: Array<UmbTableColumn> = [
    {
      name: this.localize.term("general_name"),
      alias: "name",
      elementName: "alternate-version-table-name-column-layout",
    },
    {
      name: this.localize.term("content_updateDate"),
      alias: "updateDate",
    },
    {
      name: this.localize.term("workflow_releaseSets_status"),
      alias: "status",
      elementName: "status-tag",
    },
  ];

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  constructor() {
    super();

    // conditionally add the inSet column based on the presence of the Workflow.Bundle.ReleaseSets extension
    // release sets may be unregistered, but should not impact on display of alternate versions
    this.observe(
      umbExtensionsRegistry.byAlias("Workflow.Bundle.ReleaseSets"),
      (bundle) => {
        if (!bundle) return;

        this._tableColumns.push({
          name: this.localize.term("workflow_alternateVersions_inSet"),
          alias: "inSet",
          elementName: "alternate-version-table-inset-column-layout",
        });
      }
    );

    this.consumeContext(UMB_COLLECTION_CONTEXT, (context) => {
      if (!context) return;
      this.#collectionContext = context;

      context.setupView(this);

      this.observe(context.workspacePathBuilder, (builder) => {
        if (!builder) return;
        this._modalPath = builder({ entityType: ALTERNATEVERSION_ENTITY_TYPE });
        this.#observeCollectionItems();
      });
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, async (context) => {
      this.workspaceContext = context;
    });
  }

  async #observeCollectionItems() {
    if (!this.#collectionContext) return;

    this.observe(this.#collectionContext.items, (collectionItems) => {
      this.#createTableItems(collectionItems);
    });

    this.observe(
      this.#collectionContext.loading,
      (loading) => (this._loading = loading)
    );

    this.observe(this.#collectionContext.selection.selection, (selection) => {
      this._selection = selection as string[];
    });
  }

  #onSelect(event: UmbTableSelectedEvent) {
    event.stopPropagation();
    this.#updateSelection(event.target as UmbTableElement);
  }

  #onDeselect(event: UmbTableDeselectedEvent) {
    event.stopPropagation();
    this.#updateSelection(event.target as UmbTableElement);
  }

  #updateSelection(table: UmbTableElement) {
    this.#collectionContext?.selection.setSelection(table.selection);
  }

  #createTableItems(result: Array<WorkflowAlternateVersionCollectionModel>) {
    this._tableItems = result
      .filter((x) => !x.active)
      .map((version: WorkflowAlternateVersionCollectionModel) => {
        return {
          id: version.unique,
          icon: version.icon ?? "icon-documents",
          data: [
            {
              columnAlias: "name",
              value: {
                name: version.name,
                unique: version.unique,
                modalPath: this._modalPath,
              },
            },
            {
              columnAlias: "updateDate",
              value: this.localize.date(
                version.updateDate ?? "",
                TimeFormatOptions
              ),
            },
            {
              columnAlias: "status",
              value: version.status,
            },
            {
              columnAlias: "inSet",
              value: version.inSet,
            },
          ],
        };
      });
  }

  #renderTable() {
    return when(
      this._tableItems.length,
      () => html`
        <umb-table
          .config=${this._tableConfig}
          .columns=${this._tableColumns}
          .items=${this._tableItems}
          .selection=${this._selection}
          @selected=${this.#onSelect}
          @deselected=${this.#onDeselect}
        ></umb-table>
      `,
      () => html`<div class="flex">
        ${this.localize.term("content_noItemsToShow")}
      </div>`
    );
  }

  render() {
    return when(
      this._loading,
      () => html`<uui-loader-bar></uui-loader-bar>`,
      () => this.#renderTable()
    );
  }

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
      }

      .flex {
        display: flex;
        justify-content: center;
      }
    `,
  ];
}

export default AlternateVersionsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AlternateVersionsTableElement;
  }
}
