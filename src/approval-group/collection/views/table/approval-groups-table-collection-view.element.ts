import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
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
import type { WorkflowApprovalGroupCollectionModel } from "../../entities.js";

import "./elements/approval-groups-table-name-column-layout.element.js";
import "./elements/approval-groups-table-membership-column-layout.element.js";
import "./elements/approval-groups-table-permissions-column-layout.element.js";
import "./elements/approval-groups-table-email-column-layout.element.js";

const elementName = "approval-groups-table";

@customElement(elementName)
export class ApprovalGroupsTableElement extends UmbLitElement {
  #collectionContext?: UmbDefaultCollectionContext<WorkflowApprovalGroupCollectionModel>;

  @state()
  private _loading = true;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: false,
  };

  @state()
  private _tableColumns: Array<UmbTableColumn> = [
    {
      name: this.localize.term("general_name"),
      alias: "groupName",
      elementName: "approval-groups-table-name-column-layout",
    },
    {
      name: this.localize.term("workflow_membership"),
      alias: "membership",
      elementName: "approval-groups-table-membership-column-layout",
    },
    {
      name: this.localize.term("workflow_permissions"),
      alias: "permissions",
      elementName: "approval-groups-table-permissions-column-layout",
    },
    {
      name: this.localize.term("workflow_emailGroup"),
      alias: "emailGroup",
      elementName: "approval-groups-table-email-column-layout",
    },
    {
      name: "",
      alias: "entityActions",
      elementName: "base-table-entity-actions-column-layout",
    },
  ];

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  constructor() {
    super();

    this.consumeContext(UMB_COLLECTION_CONTEXT, (instance) => {
      this.#collectionContext = instance;
      this.#observeCollectionItems();
    });
  }

  async #observeCollectionItems() {
    if (!this.#collectionContext) return;

    this.observe(
      this.#collectionContext.items,
      (collectionItems) => {
        this.#createTableItems(collectionItems);
      },
      "workflowApprovalGroupsCollectionItemsObserver"
    );

    this.observe(
      this.#collectionContext.loading,
      (loading) => (this._loading = loading)
    );
  }

  #createTableItems(result: Array<WorkflowApprovalGroupCollectionModel>) {
    this._tableItems = result.map(
      (userGroup: WorkflowApprovalGroupCollectionModel) => {
        return {
          id: userGroup.unique,
          icon: userGroup.icon,
          data: [
            {
              columnAlias: "groupName",
              value: {
                name: userGroup.name,
                unique: userGroup.unique,
              },
            },
            {
              columnAlias: "membership",
              value: {
                members: userGroup.members,
              },
            },
            {
              columnAlias: "permissions",
              value: {
                permissions: userGroup.permissions,
              },
            },
            {
              columnAlias: "emailGroup",
              value: {
                groupEmail: userGroup.groupEmail,
                members: userGroup.members,
              },
            },
            {
              columnAlias: "entityActions",
              value: userGroup,
            },
          ],
        };
      }
    );
  }

  #renderTable() {
    return when(
      this._tableItems.length,
      () => html`
        <umb-table
          .config=${this._tableConfig}
          .columns=${this._tableColumns}
          .items=${this._tableItems}
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

export default ApprovalGroupsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableElement;
  }
}
