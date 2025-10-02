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
import type { WorkflowReleaseSetCollectionModel } from "../../entities.js";
import { RELEASESET_ENTITY_TYPE } from "../../../constants.js";

import "./elements/release-set-table-name-column-layout.element.js";

const elementName = "release-sets-table";

@customElement(elementName)
export class ReleaseSetsTableElement extends UmbLitElement {
  #collectionContext?: UmbDefaultCollectionContext<WorkflowReleaseSetCollectionModel>;

  @state()
  private _loading = true;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: true,
  };

  @state()
  private _selection: Array<string> = [];

  @state()
  private _modalPath?: string;

  @state()
  private _tableColumns: Array<UmbTableColumn> = [
    {
      name: this.localize.term("general_name"),
      alias: "name",
      elementName: "release-set-table-name-column-layout",
    },
    {
      name: this.localize.term("workflow_releaseSets_itemCount"),
      alias: "itemCount",
    },
    {
      name: this.localize.term("general_status"),
      alias: "status",
      elementName: "status-tag",
    },
  ];

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  constructor() {
    super();

    this.consumeContext(UMB_COLLECTION_CONTEXT, (context) => {
      if (!context) return;
      this.#collectionContext = context;

      context.setupView(this);

      this.observe(context.workspacePathBuilder, builder => {
        if (!builder) return;
        this._modalPath = builder({ entityType: RELEASESET_ENTITY_TYPE });
        this.#observeCollectionItems();
      });
    });
  }

  async #observeCollectionItems() {
    if (!this.#collectionContext) return;

    this.observe(
      this.#collectionContext.items,
      (collectionItems) => {
        this.#createTableItems(collectionItems);
      },
      "workflowReleaseSetsCollectionItemsObserver"
    );

    this.observe(
      this.#collectionContext.loading,
      (loading) => (this._loading = loading)
    );

    this.observe(this.#collectionContext.selection.selection, (selection) => {
      this._selection = selection.filter(x => x !== null) ?? []
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

  #createTableItems(result: Array<WorkflowReleaseSetCollectionModel>) {
    this._tableItems = result.map((set: WorkflowReleaseSetCollectionModel) => {
      return {
        id: set.unique,
        icon: set.icon ?? "icon-document",
        data: [
          {
            columnAlias: "name",
            value: {
              name: set.name,
              unique: set.unique,
              modalPath: this._modalPath,
            },
          },
          {
            columnAlias: "status",
            value: set.status,
          },
          {
            columnAlias: "itemCount",
            value: set.itemCount,
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

export default ReleaseSetsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ReleaseSetsTableElement;
  }
}
