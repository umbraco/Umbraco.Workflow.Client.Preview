import type { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import type { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableDeselectedEvent,
  UmbTableElement,
  UmbTableItem,
  UmbTableSelectedEvent,
} from "@umbraco-cms/backoffice/components";
import { css, html, state, when } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../workspace/release-set-workspace.context-token.js";

export class WorkflowReleaseSetComponentTableCollectionViewBaseElement<
  EntityType extends { entityType: string; unique: string },
  CollectionContext extends UmbDefaultCollectionContext<EntityType>
> extends UmbLitElement {
  protected collectionContext?: CollectionContext;
  protected workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;
  protected init: Promise<unknown>;

  @state()
  protected tableColumns: Array<UmbTableColumn> = [];

  @state()
  protected tableConfig: UmbTableConfig = {
    allowSelection: true,
  };

  @state()
  protected tableItems: Array<UmbTableItem> = [];

  @state()
  protected loading = true;

  @state()
  protected selection: Array<string> = [];

  constructor(
    contextToken: UmbContextToken<CollectionContext>
  ) {
    super();

    this.init = Promise.all([
      this.consumeContext(contextToken, (context) => {
        this.collectionContext = context;
        this.#observeCollectionItems();
      }).asPromise(),

      this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
        this.workspaceContext = context;
      }).asPromise(),
    ]);
  }

  #observeCollectionItems() {
    this.observe(this.collectionContext?.loading, (loading) => {
      this.loading = loading ?? false;
    });

    this.observe(this.collectionContext?.selection.selection, (selection) => {
      this.selection = selection?.filter((x) => x !== null) ?? [];
    });
  }

  onSelect(event: UmbTableSelectedEvent) {
    event.stopPropagation();
    this.#updateSelection(event.target as UmbTableElement);
  }

  onDeselect(event: UmbTableDeselectedEvent) {
    event.stopPropagation();
    this.#updateSelection(event.target as UmbTableElement);
  }

  #updateSelection(table: UmbTableElement) {
    const selection = table.selection;
    this.collectionContext?.selection.setSelection(selection);
  }

  #renderTable() {
    return when(
      this.tableItems.length,
      () => html`
        <umb-table
          .config=${this.tableConfig}
          .columns=${this.tableColumns}
          .items=${this.tableItems}
          .selection=${this.selection}
          @selected=${this.onSelect}
          @deselected=${this.onDeselect}
        ></umb-table>
      `,
      () => html`<div class="flex">
        ${this.localize.term("content_noItemsToShow")}
      </div>`
    );
  }

  render() {
    return when(
      this.loading,
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
